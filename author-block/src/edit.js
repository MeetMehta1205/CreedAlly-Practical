import { useState, useEffect } from '@wordpress/element';
import { Spinner, PanelBody, ToggleControl } from '@wordpress/components';
import { __ } from '@wordpress/i18n';
import { useBlockProps, InspectorControls } from '@wordpress/block-editor';
import apiFetch from '@wordpress/api-fetch';

const Edit = ({ attributes, setAttributes }) => {
    const blockProps = useBlockProps();
    const [userData, setUserData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [enableAuthorImage, setEnableAuthorImage] = useState(attributes.enableAuthorImage || true);
    const [enableAuthorBio, setEnableAuthorBio] = useState(attributes.enableAuthorBio || true);
    const [enableAuthorSocialLink, setEnableAuthorSocialLink] = useState(attributes.enableAuthorSocialLink || true);

    const onEnableAuthorImageChange = (value) => {
        setAttributes({ enableAuthorImage: value });
        setEnableAuthorImage(value);
    };

    const onEnableAuthorBioChange = (value) => {
        setAttributes({ enableAuthorBio: value });
        setEnableAuthorBio(value);
    };

    const onEnableAuthorSocialLinkChange = (value) => {
        setAttributes({ enableAuthorSocialLink: value });
        setEnableAuthorSocialLink(value);
    };

    useEffect(() => {
        // Fetch current user data
        apiFetch({ path: '/wp/v2/users/me' })
            .then(user => {
                setUserData(user);
                // Store user data in attributes
                setAttributes({
                    userData: user
                });
                setIsLoading(false);
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
                setIsLoading(false);
            });
    }, []);

    if (isLoading) {
        return <Spinner />;
    }

    if (!userData) {
        return <div {...blockProps}>{__('User data not found.', 'author-block')}</div>;
    }

    const { name, description, avatar_urls } = userData;
    const social_link = myBlockData.social_link;
    setAttributes({
        link: social_link
    });

    return (
        <>
            <InspectorControls>
                <PanelBody title="Settings" initialOpen={true}>
                    <ToggleControl
                        label="Show Author Avatar"
                        checked={enableAuthorImage}
                        onChange={onEnableAuthorImageChange}
                    />
                    <ToggleControl
                        label="Show Author Bio"
                        checked={enableAuthorBio}
                        onChange={onEnableAuthorBioChange}
                    />
                    <ToggleControl
                        label="Show Author Social Link"
                        checked={enableAuthorSocialLink}
                        onChange={onEnableAuthorSocialLinkChange}
                    />
                </PanelBody>
            </InspectorControls>
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
                        <p className='author__link'>{__('Social Link: ', 'author-block') }{social_link}</p>
                    )}
                </div>
            </div>
        </>
    );
};

export default Edit;