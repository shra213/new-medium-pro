import { useState, type ChangeEvent } from "react";
import { signupInput } from "shraddha-common";
import { Link } from "react-router-dom";
import axios from "axios";
import { Url, userUrl } from "../config";
// import { mailToUser } from "../Hooks/sendMail";
import { useNavigate } from "react-router-dom";
type input = {
  authtype: "signin" | "signup";
};

export default function Auth({ authtype }: input) {
  const [input, setinput] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [err, seterr] = useState<{
    email?: string;
    password?: string;
  }>({});

  const [sysotp, setsysotp] = useState<number>();
  const [userOtp, setUserOtp] = useState<number>();
  const [showOtpBox, setShowOtpBox] = useState(false);
  const navigate = useNavigate();
  async function sendOtp() {
    const sysotp = Math.floor(10000 + Math.random() * 90000);
    setsysotp(sysotp);

    const res = await axios.post(`${Url}api/send-otp`, {
      email: input.email,
      otp: sysotp,
    });
    console.log(res);
    setShowOtpBox(true); // show OTP input block
  }

  async function handleOtpSubmit() {
    if (Number(userOtp) !== sysotp) {
      alert("Incorrect OTP. Please try again.");
      return;
    }

    try {
      const res = await axios.post(`${userUrl}/signup`, input, {
        headers: { "Content-Type": "application/json" },
      });

      const jwt = res.data.jwt;
      if (!jwt) throw res.data.msg;

      localStorage.setItem("icon", res.data.user.name);
      localStorage.setItem("token", jwt);
      alert("✅ Account created successfully!");
    } catch (err) {
      alert(err);
      if (err === "user already exist") {
        navigate("/signin");
      }
      console.error(err);
    }
  }

  async function onSubmit(e: any) {
    e.preventDefault();

    const suc = signupInput.safeParse(input);
    if (!suc.success) {
      alert("Please fill valid details");
      return;
    }

    if (authtype === "signup") {
      // 🔐 Only send OTP for SignUp
      await sendOtp(); // wait for OTP to arrive
    } else {
      // 🧾 Normal SignIn
      try {
        const res = await axios.post(`${userUrl}/signin`, input, {
          headers: { "Content-Type": "application/json" },
        });

        const jwt = res.data.jwt;
        if (!jwt) throw res.data.msg;

        localStorage.setItem("icon", res.data.user.name);
        localStorage.setItem("token", jwt);
        alert("✅ Logged in successfully!");
        navigate("/");
      } catch (err) {
        alert("❌ Login failed.");
        console.error(err);
      }
    }
  }

  function oninput(e: ChangeEvent<HTMLInputElement>) {
    setinput({ ...input, [e.target.id]: e.target.value });
    checkSchema(e.target.id, e.target.value);
  }

  function checkSchema(id: string, value: string) {
    //@ts-ignore
    const fieldSchema = signupInput.pick({ [id]: true });
    const res = fieldSchema.safeParse({ [id]: value });

    if (!res.success) {
      const message = res.error.issues[0]?.message || "Invalid input";
      seterr((prev) => ({ ...prev, [id]: message }));
    } else {
      seterr((prev) => ({ ...prev, [id]: "" }));
    }
  }

  return (
    <div className="flex justify-center items-center h-screen overflow-hidden">
      <div className="max-w-[70%] flex flex-col items-center">
        <div>
          <div className="sm:text-3xl text-center text-2xl font-bold">
            {authtype === "signup" ? "Create an account" : "Sign In"}
          </div>
          <div className="text-lg text-center text-slate-400 mt-2">
            {authtype === "signup" ? (
              <>
                Already have an account?
                <Link to="/signin" className="underline ml-1">
                  Login
                </Link>
              </>
            ) : (
              <>
                Don’t have an account?
                <Link to="/signup" className="underline ml-1">
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="sm:min-w-[145%] min-w-[110%] m-4 space-y-4">
          {authtype === "signup" && (
            <InputField
              label="name"
              type="text"
              placeholder="John Doe"
              onchange={oninput}
            />
          )}
          <InputField
            label="email"
            type="email"
            placeholder="john@example.com"
            onchange={oninput}
            error={err.email}
          />
          <InputField
            label="password"
            type="password"
            placeholder="password"
            onchange={oninput}
            error={err.password}
          />
        </div>

        {authtype === "signup" && showOtpBox ? (
          <div className="mt-4 w-full sm:min-w-[145%] min-w-[110%]">
            <input
              type="number"
              placeholder="Enter OTP"
              className="border p-2 rounded w-full"
              onChange={(e) => setUserOtp(Number(e.target.value))}
            />
            <button
              onClick={handleOtpSubmit}
              className="mt-3 w-full p-2 bg-green-700 text-white rounded"
            >
              Verify OTP & Sign Up
            </button>
          </div>
        ) : (
          <button
            onClick={onSubmit}
            disabled={Object.values(err).some((msg) => msg !== "")}
            className="mt-5 bg-gray-900 text-white font-semibold rounded-lg p-2.5 sm:min-w-[145%] min-w-[110%]"
          >
            {authtype === "signup" ? "Send OTP" : "Sign In"}
          </button>
        )}
      </div>
    </div>
  );
}

type labeledInput = {
  label: string;
  type?: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  placeholder: string;
  error?: string;
};

const InputField = ({
  label,
  type = "text",
  placeholder = "",
  onchange,
  error,
}: labeledInput) => (
  <div className="mt-3">
    <label
      htmlFor={label}
      className="block mb-2 text-sm font-medium text-gray-900 dark:text-black"
    >
      {label}
    </label>
    <input
      type={type}
      id={label}
      name={label}
      className={`border text-gray-900 text-sm rounded-lg block w-full p-2.5
        ${error ? "border-red-500" : "border-gray-300"}`}
      placeholder={placeholder}
      onChange={onchange}
      required
    />
    {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
  </div>
);
