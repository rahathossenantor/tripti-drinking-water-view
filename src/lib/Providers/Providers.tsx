"use client";

import { Provider } from "react-redux";
import store from "@/redux/store";
import { ThemeProvider } from "@mui/material";
import theme from "../theme/theme";

const Providers = ({ children }: { children: React.ReactNode }) => {
    return (
        <ThemeProvider theme={theme}>
            <Provider store={store}>
                {children}
            </Provider>
        </ThemeProvider>
    );
};

export default Providers;
