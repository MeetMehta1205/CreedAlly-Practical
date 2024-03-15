<?php

/**
 * Plugin Name: Author Block
 * Description: Custom Gutenberg block to Display Author Information.
 * Version: 1.0
 * Author: Meet Mehta
 * Author URI: https://profiles.wordpress.org/MeetMehta1205
 * Text Domain: author-block
 */

if ( ! function_exists( 'author_block_register_block_category' ) ) {
    /**
     * This Function is used for add or modify gutenberg block categories
     *
     * @param array $categories
     * @param object $post
     * @return array $categories
     */
    function author_block_register_block_category($categories, $post) {
        return array_merge(
            $categories,
            array(
                array(
                    'slug' => 'author-block',
                    'title' => __('Author Block', 'author-block'),
                    'icon' => null,
                ),
            )
        );
    }
}
add_filter('block_categories', 'author_block_register_block_category', 10, 2);	

if ( ! function_exists( 'author_block_register_block' ) ) {
    /**
     * This Function is use for register author block
     */
    function author_block_register_block() {
        register_block_type_from_metadata( __DIR__ );
    }
}
add_action( 'init', 'author_block_register_block' );

if ( ! function_exists( 'author_block_add_social_links_field' ) ) {
    /**
     * This Function is use for adding custom field of social links in user Profile
     * 
     * @param object $user
     */
    function author_block_add_social_links_field($user) {
        ?>
        <h3><?php _e('Social Links', 'author-block'); ?></h3>
        <table class="form-table">
            <tr>
                <th><label for="social_link"><?php _e('Social Link', 'author-block'); ?></label></th>
                <td>
                    <input type="text" name="social_link" id="social_link" value="<?php echo esc_attr(get_the_author_meta('social_link', $user->ID)); ?>" class="regular-text" /><br />
                    <p class="description"><?php _e('Please enter your social link.', 'author-block'); ?></p>
                </td>
            </tr>
        </table>
        <?php
    }
}
add_action('show_user_profile', 'author_block_add_social_links_field' );
add_action('edit_user_profile', 'author_block_add_social_links_field' );

if ( ! function_exists( 'author_block_save_social_links_field' ) ) {
    /**
     * This Function is use for saving custom field of social links in user Profile
     * 
     * @param int $user_id
     */
    function author_block_save_social_links_field($user_id) {
        if (!current_user_can('edit_user', $user_id)) {
            return false;
        }
        update_user_meta($user_id, 'social_link', $_POST['social_link']);
    }
}
add_action('personal_options_update', 'author_block_save_social_links_field');
add_action('edit_user_profile_update', 'author_block_save_social_links_field');

function my_block_enqueue_assets() {
    wp_enqueue_script(
        'my-block-script',
        plugins_url( 'custom.js', __FILE__ ),
        array( 'wp-i18n', 'wp-blocks', 'wp-components', 'wp-element', 'wp-editor' ),
        true
    );

    $current_user = get_current_user_id();
    $social_link = get_the_author_meta( 'social_link', $current_user );
    $user_data = array(
        'social_link' => $social_link,
    );
    wp_localize_script(
        'my-block-script',
        'myBlockData',
        $user_data
    );
}
add_action( 'enqueue_block_editor_assets', 'my_block_enqueue_assets' );