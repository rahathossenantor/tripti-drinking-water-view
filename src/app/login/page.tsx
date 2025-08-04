"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import {
    Box,
    Button,
    Paper,
    Typography,
    IconButton,
    Alert,
    CircularProgress
} from "@mui/material";
import { Eye, EyeOff, Droplets } from "lucide-react";
import { FieldValues } from "react-hook-form";
import FormWrapper from "@/components/FormWrapper";
import InputWrapper from "@/components/InputWrapper";

const Login = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState("");

    const handleLogin = async (data: FieldValues) => {
        setIsLoading(true);
        setError("");

        try {
            // Simulate API call
            await new Promise(resolve => setTimeout(resolve, 1500));

            console.log("Login data:", data);

            // Add your login logic here
            // Example: await loginUser(data.username, data.password);

        } catch {
            setError("Invalid username or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    return (
        <Box
            sx={{
                minHeight: "100vh",
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                padding: 2,
                position: "relative",
                overflow: "hidden"
            }}
        >
            {/* Animated background elements */}
            <Box
                sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    background: "url('data:image/svg+xml,%3Csvg width=\"60\" height=\"60\" viewBox=\"0 0 60 60\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"none\" fill-rule=\"evenodd\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.05\"%3E%3Ccircle cx=\"30\" cy=\"30\" r=\"4\"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')",
                    zIndex: 0
                }}
            />

            <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                style={{ zIndex: 1, width: "100%", maxWidth: "400px" }}
            >
                <Paper
                    elevation={24}
                    sx={{
                        p: 4,
                        borderRadius: 4,
                        background: "rgba(255, 255, 255, 0.95)",
                        backdropFilter: "blur(20px)",
                        border: "1px solid rgba(255, 255, 255, 0.2)",
                        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)"
                    }}
                >
                    {/* Header Section */}
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
                        >
                            <Box
                                sx={{
                                    width: 80,
                                    height: 80,
                                    borderRadius: "50%",
                                    background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    margin: "0 auto 20px",
                                    boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)"
                                }}
                            >
                                <Droplets size={40} color="white" />
                            </Box>
                        </motion.div>

                        <Typography
                            variant="h4"
                            sx={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                backgroundClip: "text",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                                mb: 1
                            }}
                        >
                            Welcome Back
                        </Typography>

                        <Typography
                            variant="body1"
                            sx={{ color: "text.secondary", mb: 2 }}
                        >
                            Sign in to your Tripti Water account
                        </Typography>
                    </Box>

                    {/* Error Alert */}
                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            style={{ marginBottom: 16 }}
                        >
                            <Alert severity="error" sx={{ borderRadius: 2 }}>
                                {error}
                            </Alert>
                        </motion.div>
                    )}

                    {/* Login Form */}
                    <FormWrapper
                        onSubmit={handleLogin}
                        defaultValues={{
                            username: "",
                            password: ""
                        }}
                    >
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <InputWrapper
                                    name="username"
                                    label="Username"
                                    type="text"
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                            "& fieldset": {
                                                borderColor: "rgba(0, 0, 0, 0.1)"
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea"
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea"
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: "#667eea"
                                            }
                                        }
                                    }}
                                />
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.5 }}
                            >
                                <InputWrapper
                                    name="password"
                                    label="Password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    sx={{
                                        "& .MuiOutlinedInput-root": {
                                            borderRadius: 3,
                                            "& fieldset": {
                                                borderColor: "rgba(0, 0, 0, 0.1)"
                                            },
                                            "&:hover fieldset": {
                                                borderColor: "#667eea"
                                            },
                                            "&.Mui-focused fieldset": {
                                                borderColor: "#667eea"
                                            }
                                        },
                                        "& .MuiInputLabel-root": {
                                            "&.Mui-focused": {
                                                color: "#667eea"
                                            }
                                        }
                                    }}
                                />
                                <Box sx={{ position: "relative" }}>
                                    <IconButton
                                        onClick={togglePasswordVisibility}
                                        sx={{
                                            position: "absolute",
                                            right: 12,
                                            top: -35,
                                            color: "text.secondary",
                                            "&:hover": {
                                                color: "#667eea"
                                            }
                                        }}
                                        size="small"
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </IconButton>
                                </Box>
                            </motion.div>

                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.6 }}
                            >
                                <Button
                                    type="submit"
                                    variant="contained"
                                    disabled={isLoading}
                                    sx={{
                                        py: 1.5,
                                        borderRadius: 3,
                                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                        boxShadow: "0 4px 20px rgba(102, 126, 234, 0.3)",
                                        fontSize: "1rem",
                                        fontWeight: 600,
                                        textTransform: "none",
                                        position: "relative",
                                        overflow: "hidden",
                                        "&:hover": {
                                            background: "linear-gradient(135deg, #5a6fd8 0%, #6a4190 100%)",
                                            boxShadow: "0 6px 25px rgba(102, 126, 234, 0.4)",
                                            transform: "translateY(-1px)"
                                        },
                                        "&:active": {
                                            transform: "translateY(0)"
                                        },
                                        "&:disabled": {
                                            background: "rgba(0, 0, 0, 0.12)",
                                            boxShadow: "none"
                                        },
                                        transition: "all 0.3s ease"
                                    }}
                                    fullWidth
                                >
                                    {isLoading ? (
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                                            <CircularProgress size={20} color="inherit" />
                                            <span>Signing In...</span>
                                        </Box>
                                    ) : (
                                        "Sign In"
                                    )}
                                </Button>
                            </motion.div>
                        </Box>
                    </FormWrapper>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                    >
                        <Typography
                            variant="body2"
                            sx={{
                                textAlign: "center",
                                color: "text.secondary",
                                mt: 3,
                                pt: 3,
                                borderTop: "1px solid rgba(0, 0, 0, 0.1)"
                            }}
                        >
                            © 2025 Tripti Drinking Water.
                        </Typography>
                    </motion.div>
                </Paper>
            </motion.div>
        </Box>
    );
};

export default Login;
