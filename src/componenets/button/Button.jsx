import PropTypes from 'prop-types'

const Button = ({ variant, children, onClick }) => {
   const variantClasses = {
    primaryWhite: "bg-blue-lighter text-white px-4 py-2 rounded-md shadow-lg font-bold uppercase transition-color duration-300 hover:bg-white hover:text-blue-lighter",
    primaryBlue: "bg-white text-blue-lighter px-4 py-2 rounded-md shadow-lg font-bold uppercase transition-color duration-300 hover:bg-blue-lighter hover:text-white",
    secondaryWhite: "bg-blue-lighter text-white font-bold uppercase p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full",
    secondaryBlue: "bg-white text-blue-lighter font-bold uppercase p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-lighter after:transition-all after:duration-300 hover:after:w-full",
   }

   return (
    <button className={`${variantClasses[variant]}`} onClick={onClick}>
        {children}
    </button>
   )
}

Button.propTypes = {
    variant: PropTypes.string.isRequired,
    children: PropTypes.node.isRequired,
    onClick: PropTypes.func,
}

Button.defaultProps = {
    variant: 'primaryWhite',
    onClick: () => {},
}

export default Button