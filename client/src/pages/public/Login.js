import React, { useCallback, useEffect, useState } from "react";
import {
  apiFinalRegister,
  apiForgotPassword,
  apiLogin,
  apiRegister,
} from "apis/user";
import Swal from "sweetalert2";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import path from "ultils/path";
import { useDispatch } from "react-redux";
import { login } from "store/user/userSlice";
import { toast } from "react-toastify";
import { validate } from "ultils/helper";
import { showModal } from "store/app/appSlice";
import { Button, InputField, Loading } from "components";

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [payload, setPayload] = useState({
    email: "",
    password: "",
    firstname: "",
    lastname: "",
    mobile: "",
  });
  const [isVerifieldEmail, setIsVerifieldEmail] = useState(false);
  const [invaliFields, setInvaliFields] = useState([]);
  const [isRegister, setIsRegister] = useState(false);
  const [isShowModal, setIsShowModal] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [searchParams] = useSearchParams();
  const resetPayload = () => {
    setPayload({
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      mobile: "",
    });
  };
  const [token, setToken] = useState("");
  const [email, setEmail] = useState("");
  const handleForgotPassword = async () => {
    const response = await apiForgotPassword({ email });
    if (response.success) {
      toast.success(response.mes, { theme: "colored" });
    } else toast.info(response.mes, { theme: "colored" });
  };
  useEffect(() => {
    resetPayload();
  }, [isRegister]);

  const handleSubmit = useCallback(async () => {
    const { firstname, lastname, mobile, ...data } = payload;
    const invalids = isRegister
      ? validate(payload, setInvaliFields)
      : validate(data, setInvaliFields);
    if (invalids === 0) {
      if (isRegister) {
        dispatch(showModal({isShowModal: true,modalChildren:<Loading/>}))
        const response = await apiRegister(payload);
        dispatch(showModal({isShowModal: false,modalChildren:null}))

        if (response.success) {
          setIsVerifieldEmail(true);
        } else Swal.fire("Opps!", response.mes, "error");
      } else {
        const rs = await apiLogin(data);
        if (rs.success) {
          dispatch(
            login({
              isLoggedIn: true,
              token: rs.accessToken,
              userData: rs.userData,
            })
          );
          searchParams.get('redirect')? navigate(searchParams.get('redirect')) : navigate(`/${path.HOME}`);
        } else Swal.fire("Opps!", rs.mes, "error");
      }
    }
  }, [payload, isRegister]);

  const finalRegister = async () => {
    const response = await apiFinalRegister(token);
    if (response.success) {
      Swal.fire("Congratulation", response.mes, "success").then(() => {
        setIsRegister(false);
        resetPayload();
      });
    } else Swal.fire("Opps!", response.mes, "error");
    setIsVerifieldEmail(false);
    setToken("");
  };

  return (
    <div className="w-screen h-screen relative">
      {isVerifieldEmail && (
        <div className="absolute top-0 right-0 left-0 bottom-0 bg-overlay z-50 flex flex-col items-center justify-center">
          <div className="bg-pink-200 w-[500px] rounded-md p-8">
            <h4 className="">
              We sent a code to your mail.Please check your mail and enter your
              code:
            </h4>
            <input
              type="text"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="p-2 border rounded-md outline-none"
            />
            <button
              type="button"
              className="px-4 py-2 bg-main font-semibold text-pink-300 rounded-md ml-4"
              onClick={finalRegister}
            >
              Submit
            </button>
          </div>
        </div>
      )}
      {isForgotPassword && (
        <div className="absolute animate-slide-right top-0 left-0 bottom-0 right-0 bg-pink-100 flex flex-col items-center py-8 z-50">
          <div className="flex flex-col gap-4">
            <label htmlFor="email">Enter your email:</label>
            <input
              type="text"
              id="email"
              className="w-[800px] pb-2 border-b outline-none placeholder:text-sm"
              placeholder="Exp: email@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center justify-end w-full gap-4">
              <Button
                name="Submit"
                handleOnClick={handleForgotPassword}
                style="px-4 py-2 rounded-md text-white bg-pink-500 text-semibold my-2"
              />
              <Button
                name="Back"
                handleOnClick={() => setIsForgotPassword(false)}
              />
            </div>
          </div>
        </div>
      )}
      <img
        src="https://uploads-ssl.webflow.com/5fbd61596e034630dd2b86af/62626dcb774f0974b0237f70_biggest%20ecommerce%20challenges%20this%20year.jpg"
        alt=""
        className="w-full h-full object-cover"
      />
      <div className="absolute top-0 bottom-0 left-0 right-1/2 flex items-center justify-center">
        <div className="p-8 bg-pink-300 opacity-90 flex flex-col items-center rounded-md min-w-[500px] ">
          <h1 className="text-[28px] font-semibold text-main mb-8">
            {isRegister ? "Register" : "Login"}
          </h1>
          {isRegister && (
            <div className="flex items-center gap-2">
              <InputField
                value={payload.firstname}
                setValue={setPayload}
                nameKey="firstname"
                invalidFields={invaliFields}
                setInvalidFields={setInvaliFields}
              />
              <InputField
                value={payload.lastname}
                setValue={setPayload}
                nameKey="lastname"
                invalidFields={invaliFields}
                setInvalidFields={setInvaliFields}
              />
            </div>
          )}
          {isRegister && (
            <InputField
              value={payload.mobile}
              setValue={setPayload}
              nameKey="mobile"
              invalidFields={invaliFields}
              setInvalidFields={setInvaliFields}
            />
          )}
          <InputField
            value={payload.email}
            setValue={setPayload}
            nameKey="email"
            invalidFields={invaliFields}
            setInvalidFields={setInvaliFields}
          />
          <InputField
            value={payload.password}
            setValue={setPayload}
            nameKey="password"
            type="password"
            invalidFields={invaliFields}
            setInvalidFields={setInvaliFields}
          />
          <Button handleOnClick={handleSubmit} fw>
            {isRegister ? "Register" : "Login"}
          </Button>
          <div className="flex items-center justify-between my-2 w-full text-sm">
            {!isRegister && (
              <span
                onClick={() => setIsForgotPassword(true)}
                className="text-purple-700 hover:underline cursor-pointer"
              >
                Forgot your account?
              </span>
            )}
            {!isRegister && (
              <span
                onClick={() => setIsRegister(true)}
                className="text-purple-700 hover:underline cursor-pointer"
              >
                Create Account
              </span>
            )}
            {isRegister && (
              <span
                onClick={() => setIsRegister(false)}
                className="text-purple-700 hover:underline cursor-pointer w-full text-center"
              >
                Go Login
              </span>
            )}
          </div>
          <Link
            className="text-purple-700 text-sm hover:underline cursor-pointer"
            to={`/${path.HOME}`}
          >
            Go Home?
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;
