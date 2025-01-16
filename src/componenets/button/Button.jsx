import PropTypes from 'prop-types'

const Button = ({ variant, children, onClick }) => {
   const variantClasses = {
    primaryWhite: "bg-blue-lighter px-6 py-1 lg:px-9 lg:py-2 rounded-md shadow-lg transition-color duration-300 hover:bg-white hover:text-blue-lighter text-white font-bold uppercase text-xl lg:text-2xl h",
    primaryBlue: "bg-white text-blue-lighter px-6 py-1 lg:px-9 lg:py-2 rounded-md shadow-lg transition-color duration-300 hover:bg-blue-lighter hover:text-white font-bold uppercase text-xl lg:text-2xl",
    secondaryWhite: "bg-blue-lighter p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-white after:transition-all after:duration-300 hover:after:w-full text-white font-bold uppercase text-sm lg:text-base",
    secondaryBlue: "bg-white text-blue-lighter font-bold uppercase p-0 relative after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-blue-lighter after:transition-all after:duration-300 hover:after:w-full text-sm lg:text-base",
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