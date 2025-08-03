import { MenuItem, SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TInputSelectWrapperProps = {
    name: string;
    size?: "small" | "medium";
    placeholder?: string;
    label?: string;
    required?: boolean;
    fullWidth?: boolean;
    sx?: SxProps;
    items: string[];
};

const InputSelectWrapper = ({
    items,
    name,
    label,
    size = "small",
    required = false,
    fullWidth = true,
    sx = {},
}: TInputSelectWrapperProps
) => {
    const { control, formState } = useFormContext();
    const isError = formState.errors[name] !== undefined;

    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <TextField
                    {...field}
                    id={`select-${name}`} // Add unique id for accessibility
                    value={field.value || ""} // Ensure value is never undefined
                    sx={sx}
                    size={size}
                    select
                    label={label}
                    required={required}
                    fullWidth={fullWidth}
                    error={isError}
                    helperText={
                        isError ? (formState.errors[name]?.message as string) : ""
                    }
                >
                    {items.map((name) => (
                        <MenuItem key={name} value={name}>
                            {name}
                        </MenuItem>
                    ))}
                </TextField>
            )}
        />
    );
};

export default InputSelectWrapper;
