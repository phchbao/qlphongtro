import { useEffect, useState, useCallback } from "react";
import {
  Logo,
  FormPasswordField,
  FormTextField,
  AlertToast,
} from "../components";
import { useDispatch, useSelector } from "react-redux";
import {
  clearAlert,
  loginOwner,
  loginLodger,
  stateClear,
} from "../features/auth/authSlice";
import { useNavigate, useParams, Link } from "react-router-dom";
import loginImg from "../assets/images/loginImg.svg";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const Login = () => {
  const {
    user,
    accountStatus,
    success,
    userType,
    errorMsg,
    errorFlag,
    alertType,
    isLoading,
  } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const param = useParams();
  const dispatch = useDispatch();

  const [values, setFormValues] = useState({ email: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate(`/${userType}`);
    }
  }, [user, navigate, userType]);

  useEffect(() => {
    if (success && accountStatus) {
      navigate(`/${userType}`);
    } else if (success && !accountStatus) {
      navigate(`/account-created/${userType}`);
      dispatch(stateClear());
    }
  }, [accountStatus, success, navigate, userType, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const { email, password } = values;
    const userInfo = {
      email,
      password,
      role: param.role,
    };
    if (param.role === "owner") {
      dispatch(loginOwner({ userInfo }));
    } else if (param.role === "lodger") {
      dispatch(loginLodger({ userInfo }));
    }
  };

  const handleClose = useCallback(
    (event, reason) => {
      if (reason === "clickaway") {
        return;
      }
      dispatch(clearAlert());
    },
    [dispatch]
  );

  const handleChange = useCallback(
    (e) => {
      setFormValues({ ...values, [e.target.name]: e.target.value });
    },
    [values]
  );

  const handleFillCredentials = useCallback(() => {
    setFormValues({
      email:
        param.role === "owner"
          ? "test_owner_user@room.com"
          : "test_lodger_user@room.com",
      password: "secret",
    });
  }, []);

  return (
    <div>
      <header className="flex m-1 shadow-sm">
        <Logo />
        <div className="flex flex-col justify-center ml-2">
          <h5 className="font-display">Trọ số</h5>
          <p className="hidden text-xs md:block md:text-sm">
            since 2024
          </p>
        </div>
      </header>

      <main className="px-6 h-full mt-12">
        <div className="flex lg:justify-between justify-center items-center flex-wrap h-full g-6">
          <div className="grow-0 shrink-1 md:shrink-0 basis-auto lg:w-6/12 md:w-9/12 mb-12 md:mb-0">
            <img src={loginImg} className="w-full" alt="login banner" />
          </div>
          <div className="lg:w-5/12 md:w-8/12 mb-12 md:mb-0">
            <form onSubmit={handleSubmit}>
              <div className="flex flex-col gap-6 mb-2">
                <FormTextField
                  value={values.email}
                  name={"email"}
                  type={"email"}
                  label={"Email"}
                  handleChange={handleChange}
                  autoFocus={true}
                />
                <FormPasswordField
                  value={values.password}
                  handleChange={handleChange}
                />
                <div>
                  <Button
                    variant="contained"
                    size="medium"
                    color="tertiary"
                    disabled={isLoading}
                    sx={{
                      color: "white",
                    }}
                    onClick={handleFillCredentials}
                  >
                    Đăng nhập với tư cách khách
                  </Button>
                </div>
                <div className="self-end">
                  <Link
                    to={`/forgot-password/${param.role}`}
                    className="text-sm text-tertiary font-robotoNormal hover:text-tertiaryDark transition duration-200 ease-in-out"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </div>

              <div className="text-center">
                <div className="mx-auto w-3/4 md:w-1/3">
                  <Button
                    variant="contained"
                    type="submit"
                    size="medium"
                    color="primary"
                    disabled={isLoading}
                    sx={{
                      color: "white",
                      width: "100%",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                        opacity: [0.9, 0.8, 0.7],
                      },
                    }}
                  >
                    {isLoading ? (
                      <CircularProgress
                        size={26}
                        sx={{
                          color: "#fff",
                        }}
                      />
                    ) : (
                      "Đăng nhập"
                    )}
                  </Button>
                </div>
                <p className="text-sm font-medium mt-4 pt-1 mb-0 md:text-base">
                  Chưa có tài khoản?{" "}
                  <Link
                    to={`/register/${param.role}`}
                    className="text-secondary hover:text-secondaryDark transition duration-200 ease-in-out"
                  >
                    Đăng kí
                  </Link>
                </p>
              </div>
            </form>
          </div>
        </div>
      </main>
      <AlertToast
        alertFlag={errorFlag}
        alertMsg={errorMsg}
        alertType={alertType}
        handleClose={handleClose}
      />
    </div>
  );
};

export default Login;
