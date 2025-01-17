import PropTypes from 'prop-types'

const Card = ({ icon, nickname, answer, hint1, hint2 }) => {
    return (
        <div className="bg-gray-to-b from-blue-lighter to-blue-darker backdrop-blur-md to-blue-900/70 rounded-md shadow-lg p-4">
            <div>
                <h3>{nickname}</h3>
                <figure>
                    <img src={icon} alt={nickname} />
                </figure>
                <span>{answer}</span>
                <p>{hint1}</p>
                <p>{hint2}</p>
            </div>
        </div>
    )
}

Card.propTypes = {
    icon: PropTypes.string.isRequired,
    nickname: PropTypes.string.isRequired,
    answer: PropTypes.string.isRequired,
    hint1: PropTypes.string.isRequired,
    hint2: PropTypes.string.isRequired,
}

export default Card