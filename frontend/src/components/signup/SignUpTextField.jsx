const SignUpTextField = ({
  icon,
  type,
  placeholder,
  name,
  inputChange,
  value,
}) => {
  return (
    <>
      <label className="input input-bordered flex items-center gap-2">
        {icon}
        <input
          type={type}
          className="grow"
          placeholder={placeholder}
          name={name}
          onChange={inputChange}
          value={value}
        />
      </label>
    </>
  );
};

export default SignUpTextField;
