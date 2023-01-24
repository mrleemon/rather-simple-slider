(function ($) {

	$(function () {

		// slider gallery file uploads.
		var l10n = wp.media.view.l10n;
		var $image_gallery_ids = $('#slider_items');
		var $slider_images = $('#slider_images_container').find('ul.slider_images');

		$('.add_slider_images').on('click', 'a', function (e) {
			var $el = $(this);
			var slider_gallery_frame;

			e.preventDefault();

			// If the media frame already exists, reopen it.
			if (slider_gallery_frame) {
				slider_gallery_frame.open();
				return;
			}

			// Create the media frame.
			slider_gallery_frame = wp.media.frames.slider_gallery = wp.media({
				// Set the title of the modal.
				title: $el.data('choose'),
				button: {
					text: l10n.select
				},
				states: [
					new wp.media.controller.Library({
						title: $el.data('choose'),
						filterable: 'all',
						multiple: true
					})
				]
			});

			// When an image is selected, run a callback.
			slider_gallery_frame.on('select', function () {
				var selection = slider_gallery_frame.state().get('selection');
				var attachment_ids = $image_gallery_ids.val();

				selection.map(function (attachment) {
					attachment = attachment.toJSON();
					if (attachment.id) {
						if (attachment.type == 'image') {
							attachment_ids = attachment_ids ? attachment_ids + ',' + attachment.id : attachment.id;
							var attachment_image = attachment.sizes && attachment.sizes.thumbnail ? attachment.sizes.thumbnail.url : attachment.url;
							$slider_images.append('<li class="image" data-attachment_id="' + attachment.id + '"><a class="edit_item" href="#"><img src="' + attachment_image + '" /></a><ul class="actions"><li><a href="#" class="delete" title="' + $el.data('delete') + '">' + $el.data('text') + '</a></li></ul></li>');
						}

					}
				});

				$image_gallery_ids.val(attachment_ids);
			});

			// Finally, open the modal.
			slider_gallery_frame.open();
		});

		// Image ordering.
		$slider_images.sortable({
			items: 'li.image',
			cursor: 'move',
			scrollSensitivity: 40,
			forcePlaceholderSize: true,
			forceHelperSize: false,
			helper: 'clone',
			opacity: 0.65,
			placeholder: 'rsc-metabox-sortable-placeholder',
			start: function (e, ui) {
				ui.item.css('background-color', '#f6f6f6');
			},
			stop: function (e, ui) {
				ui.item.removeAttr('style');
			},
			update: function () {
				var attachment_ids = '';

				$('#slider_images_container').find('ul li.image').css('cursor', 'default').each(function () {
					var attachment_id = $(this).attr('data-attachment_id');
					attachment_ids = attachment_ids + attachment_id + ',';
				});

				$image_gallery_ids.val(attachment_ids);
			}
		});

		// Remove images.
		$('#slider_images_container').on('click', 'a.delete', function () {
			$(this).closest('li.image').remove();

			var attachment_ids = '';

			$('#slider_images_container').find('ul li.image').css('cursor', 'default').each(function () {
				var attachment_id = $(this).attr('data-attachment_id');
				attachment_ids = attachment_ids + attachment_id + ',';
			});

			$image_gallery_ids.val(attachment_ids);

			// Remove any lingering tooltips.
			$('#tiptip_holder').removeAttr('style');
			$('#tiptip_arrow').removeAttr('style');

			return false;
		});

		// Edit images.
		$('#slider_images_container').on('click', 'a.edit_item', function (e) {
			var $el = $(this);
			var slider_gallery_edit_frame;
			var selected = $(this).parent().attr('data-attachment_id');

			e.preventDefault();

			// If the media frame already exists, reopen it.
			if (slider_gallery_edit_frame) {
				slider_gallery_edit_frame.on('open', function () {
					var library = slider_gallery_edit_frame.state().get('library');

					// Overload the library's comparator to push items that are not in
					// the mirrored query to the front of the aggregate collection.
					library.comparator = function (a, b) {
						var aInQuery = !!this.mirroring.get(a.cid),
							bInQuery = !!this.mirroring.get(b.cid);

						if (!aInQuery && bInQuery) {
							return -1;
						} else if (aInQuery && !bInQuery) {
							return 1;
						} else {
							return 0;
						}
					};

					var selection = slider_gallery_edit_frame.state().get('selection');

					// Add the selected item to the library, so 
					// images that are not initially loaded still appear.
					attachment = wp.media.attachment(selected);
					attachment.fetch();
					library.add(attachment ? [attachment] : []);

					selection.reset(selected ? [wp.media.attachment(selected)] : []);
				});
				slider_gallery_edit_frame.open();
				return;
			}

			// Create the media frame.
			slider_gallery_edit_frame = wp.media.frames.slider_gallery = wp.media({
				// Set the title of the modal.
				title: $el.data('choose'),
				button: {
					text: l10n.back
				},
				states: [
					new wp.media.controller.Library({
						title: $el.data('choose'),
						filterable: 'all',
						multiple: false
					})
				]
			});

			slider_gallery_edit_frame.on('open', function () {
				var library = slider_gallery_edit_frame.state().get('library');

				// Overload the library's comparator to push items that are not in
				// the mirrored query to the front of the aggregate collection.
				library.comparator = function (a, b) {
					var aInQuery = !!this.mirroring.get(a.cid),
						bInQuery = !!this.mirroring.get(b.cid);

					if (!aInQuery && bInQuery) {
						return -1;
					} else if (aInQuery && !bInQuery) {
						return 1;
					} else {
						return 0;
					}
				};

				var selection = slider_gallery_edit_frame.state().get('selection');

				// Add the selected item to the library, so 
				// images that are not initially loaded still appear.
				attachment = wp.media.attachment(selected);
				attachment.fetch();
				library.add(attachment ? [attachment] : []);

				selection.reset(selected ? [wp.media.attachment(selected)] : []);
			});

			// Finally, open the modal.
			slider_gallery_edit_frame.open();

		});

	});

})(jQuery);

