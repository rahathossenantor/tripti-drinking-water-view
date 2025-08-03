/* eslint-disable @typescript-eslint/no-explicit-any */
import { FieldValues, FormProvider, SubmitHandler, useForm } from "react-hook-form";

type TFormProps = {
    children: React.ReactNode;
    onSubmit: SubmitHandler<FieldValues>;
};

type TFormConfig = {
    resolver?: any;
    defaultValues?: Record<string, any>;
};

const FormWrapper = ({ children, onSubmit, resolver, defaultValues }: TFormProps & TFormConfig) => {
    const formConfig: TFormConfig = {
        // Always provide an empty object as default values to prevent undefined values
        defaultValues: defaultValues || {}
    };

    if (resolver) {
        formConfig["resolver"] = resolver;
    };

    const methods = useForm(formConfig);
    const { handleSubmit, reset } = methods;

    return (
        <FormProvider {...methods}>
            <form onSubmit={handleSubmit((values) => {
                onSubmit(values);
                reset();
            })}>
                {children}
            </form>
        </FormProvider>
    );
};

export default FormWrapper;
