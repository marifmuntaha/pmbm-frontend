import Select, {type Props as SelectProps } from "react-select";

type RSelectProps<Option, IsMulti extends boolean = false> =
    SelectProps<Option, IsMulti> & {
    className?: string;
};

export const RSelect = <Option, IsMulti extends boolean = false>(
    props: RSelectProps<Option, IsMulti>
) => {
    const { className, ...rest } = props;

    return (
        <div className="form-control-select">
            <Select<Option, IsMulti>
                className={`react-select-container ${className ?? ""}`}
                classNamePrefix="react-select"
                {...rest}
            />
        </div>
    );
};