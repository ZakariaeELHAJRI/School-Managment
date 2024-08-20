
import { Image } from 'react-bootstrap';
import PropTypes from 'prop-types';
import GKTippy from '../../widgets/tooltips/GKTippy';


const Avatar = (props) => {
	const {
		size,
		type,
		src,
		alt,
		name,
		className,
		status,
		soft,
		variant,
		showExact,
		imgtooltip,
		bodyClasses
	} = props;

	const GetAvatar = () => {
		if (type === 'initial' && name) {
			var matches = name.match(/\b(\w)/g);
			var acronym = showExact ? name : matches.join('');
			if (soft) {
				return imgtooltip ? (
					<GKTippy content={name}>
						<span className={`avatar avatar-${size} avatar-${variant}-soft me-0 mb-2 mb-lg-0`}>
							<span className={`avatar-initials ${className}`}>{acronym}</span>
						</span>
					</GKTippy>
				) : (
					<span
						className={`avatar avatar-${size} avatar-${variant}-soft me-0 mb-2 mb-lg-0`}
					>
						<span className={`avatar-initials ${className}`}>{acronym}</span>
					</span>
				);
			}
			if (imgtooltip && name) {
				return (
					<GKTippy content={name}>
						<span title={alt}
							className={`avatar avatar-${size} avatar-primary me-0 mb-2 mb-lg-0 ${
								status ? 'avatar-indicators avatar-' + status : ''
							}`}
						>
							<span className={`avatar-initials bg-${variant} ${className}`}>
								{acronym}
							</span>
						</span>
					</GKTippy>					
				);
			} else {
				return (
					<span
						title={alt}
						className={`avatar avatar-${size} avatar-primary me-0 mb-2 mb-lg-0 ${
							status ? 'avatar-indicators avatar-' + status : ''
						}`}
					>
						<span className={`avatar-initials bg-${variant} ${className}`}>
							{acronym}
						</span>
					</span>
				);
			}
		} else if (type === 'image' && src) {
			if (imgtooltip && name) {
				return (
					<span
						className={`avatar avatar-${size} me-1 ${
							status ? 'avatar-indicators mb-2 mb-lg-0 avatar-' + status : ''
						} ${bodyClasses ? bodyClasses : ''}`}
					>
						<GKTippy content={name}>
							<Image src={src} alt={alt} className={`mb-2 mb-lg-0 ${className}`} />
						</GKTippy>
					</span>
				);
			} else {
				return (
					<span className={`avatar avatar-${size} me-0 ${
							status ? 'avatar-indicators mb-2 mb-lg-0 avatar-' + status : ''
						}`}
					>
						<Image src={src} alt={alt} className={`mb-2 mb-lg-0 ${className}`}/>
					</span>
				);
			}
		} else {
			return (
				<span
					dangerouslySetInnerHTML={{
						__html: 'Required Avatar parameter not found'
					}}
				></span>
			);
		}
	};
	return <GetAvatar />;
};

Avatar.propTypes = {
	size: PropTypes.oneOf(['xxl', 'xl', 'lg', 'md', 'sm', 'xs']),
	type: PropTypes.oneOf(['image', 'initial']),
	src: PropTypes.string,
	alt: PropTypes.string,
	name: PropTypes.string,
	status: PropTypes.oneOf(['online', 'away', 'offline', 'busy']),
	className: PropTypes.string,
	variant: PropTypes.oneOf([
		'primary',
		'secondary',
		'success',
		'danger',
		'warning',
		'info',
		'light',
		'dark'
	]),
	soft: PropTypes.bool,
	showExact: PropTypes.bool,
	imgtooltip: PropTypes.bool,
	bodyClasses: PropTypes.string
};

Avatar.defaultProps = {
	className: '',
	size: 'md',
	variant: 'primary',
	soft: false,
	showExact: false
};

const AvatarGroup = (props) => {
	return (
		<div className={`avatar-group ${props.className ? props.className : ''}`}>
			{props.children}
		</div>
	);
};
const Ratio = (props) => {
	const { src, size, className } = props;
	return (
		<span>
			<Image
				src={src}
				alt=""
				className={`img-4by3-${size} mb-2 mb-lg-0 ${className}`}
			/>
		</span>
	);
};

export { Avatar, AvatarGroup, Ratio };
