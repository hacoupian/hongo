<?php
/**
 * Description tab
 *
 * This template can be overridden by copying it to yourtheme/woocommerce/single-product/tabs/description.php.
 *
 * HOWEVER, on occasion WooCommerce will need to update template files and you
 * (the theme developer) will need to copy the new files to your theme to
 * maintain compatibility. We try to do this as little as possible, but it does
 * happen. When this occurs the version of the template file will be bumped and
 * the readme will list any important changes.
 *
 * @see 	    https://docs.woocommerce.com/document/template-structure/
 * @author 		WooThemes
 * @package 	WooCommerce/Templates
 * @version     2.0.0
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // Exit if accessed directly
}

global $post;

/* To Enable Tab Content Heading */
$hongo_single_product_enable_tab_content_heading = hongo_option( 'hongo_single_product_enable_tab_content_heading', '0' );

$heading = apply_filters( 'woocommerce_product_description_heading', __( 'Description', 'hongo' ) );

?>

<?php if ( $hongo_single_product_enable_tab_content_heading == '1' && $heading ) : ?>
  	<h2><?php echo esc_html( $heading ); ?></h2>
<?php endif; ?>

<?php the_content(); ?>