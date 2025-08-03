import { SxProps, TextField } from "@mui/material";
import { Controller, useFormContext } from "react-hook-form";

type TInputWrapperProps = {
    name: string;
    required?: boolean;
    multiline?: boolean;
    label: string;
    type?: string;
    fullWidth?: boolean;
    sx?: SxProps;
};

const InputWrapper = ({
    name,
    label,
    type = "text",
    fullWidth = true,
    multiline = false,
    required = false,
    sx = {}
}: TInputWrapperProps
) => {
    const { control } = useFormContext();

    return (
        <Controller
            control={control}
            name={name}
            render={({ field, fieldState: { error } }) => (
                <TextField
                    {...field}
                    id={`input-${name}`} // Add unique id for accessibility
                    value={field.value || ""} // Ensure value is never undefined
                    label={label}
                    placeholder={label}
                    variant="outlined"
                    size="small"
                    multiline={multiline}
                    rows={multiline ? 4 : 1}
                    type={type}
                    fullWidth={fullWidth}
                    required={required}
                    error={!!error?.message}
                    helperText={error?.message}
                    sx={sx}
                />
            )}
        />
    );
};

export default InputWrapper;
