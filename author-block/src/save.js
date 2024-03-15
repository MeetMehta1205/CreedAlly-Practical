import { __ } from '@wordpress/i18n';
import { useBlockProps } from '@wordpress/block-editor';

const Save = ({ attributes }) => {
    const blockProps = useBlockProps.save();
	const { userData, enableAuthorImage, enableAuthorBio, enableAuthorSocialLink, link } = attributes;

    if (!userData) {
        return <div>{__('User data not found.', 'author-block')}</div>;
    }

    const { name, description, avatar_urls } = userData;

    return (
        <div {...blockProps} className='author__information'>
            { enableAuthorImage && (
                <div className='author__avatar'>
                    <img src={avatar_urls?.['96']} alt={name} />
                </div>
            )}
            <div className='author__content'>
                <h5 className='author__name'>{name}</h5>
                { enableAuthorBio && ( 
                    <p className='author__bio'>{description}</p>
                )}
                { enableAuthorSocialLink && (
                    <p className='author__link'>{__('Social Link: ', 'author-block') }{link}</p>
                )}
            </div>
        </div>
    );
};

export default Save;