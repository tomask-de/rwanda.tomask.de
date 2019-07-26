function Posts(params)
{
// Set members
   this.domShareDiv = params.domShareDiv;
   this.baseURL = params.baseURL;
   this.aLangs = params.aLangs;

// Initialize the mini-galleries
   this.galleries = $('div.gallery');
   this.galleries.each(function()
   {
   // Number of images in this mini-gallery
      var aDomImages = this.getElementsByTagName('img');
      this.numImages = aDomImages.length;

   // Initialize index of active image
      this.indexActiveImage = -1;

   // Array of image src attributes
      this.aImageSrc = new Array();

   // Initialize images in this mini-gallery
      for(var i = 0, domImage; domImage = aDomImages[i]; i++)
      {
      // Set image index
         domImage.index = i;

      // Add src to array of image src attributes
         this.aImageSrc[i] = domImage.src;
      }
   });

// Reference to this object
   var This = this;

// Add mini-gallery event handler
   $(this.galleries).click(function(e)
   {
      This.ShowImage(e);

      return false;
   });

// Add post event handlers
   var postBlocks = $('div.post');
   postBlocks.each(function()
   {
   // Get post's subject
      var subject = $('h2 a', this).text();

   // Add Post delete handler
      $('a.deletePost', this).click(function(e)
      {
         This.DeletePost(subject, this.href);
         return false;
      });
   });

// Add Share link event handler
   var itvlHideShare;
   $('a.share, #jsShareMenu').hover(function()
   {
      var domHoverTarget = this;
      var shareMenu = $(This.domShareDiv);

   // Prevent shareMenu from disappearing
      clearTimeout(itvlHideShare);

   // Find out where shareMenu currently is
      if(shareMenu.siblings('#' + this.id).length != 1 && this.id != 'jsShareMenu')
      {
      // shareMenu not in post div - Move to this post and make it visible
         $(domHoverTarget).after(This.domShareDiv);
         This.domShareDiv.style.display = 'block';

      // Get post id
         var aMatches = this.id.match(/\d+/);

      // Set shareURL and shareTitle
         This.shareURL = This.baseURL + '&post=' + aMatches;
         This.shareTitle = shareMenu.parents('div.post').children('h2').text();
      }
      else
      {
      // Display the shareMenu
         This.domShareDiv.style.display = 'block';
      }
   }, function()
   {
   // Hide the shareMenu after half a second
      itvlHideShare = setTimeout(function()
      {
         This.domShareDiv.style.display = 'none';
      }, 500);
   });
}

Posts.prototype =
{
   NEXT: 1,
   PREV: -1,

   baseURL: '',
   shareURL: '',
   shareTitle: '',

   ShowImage: function(e)
   {
      e = e || window.event;
      var domTarget = e.target || e.srcElement;

   // Determine what was clicked
      var tag = domTarget.tagName.toLowerCase();

      switch(tag)
      {
         case 'img':
      // Get src of image
         var src = domTarget.src;

      // Get gallery div of image
         var gallery = $(domTarget).parents('div.gallery');
         var domGallery = gallery.get(0);

      // If activeImage exists, remove it
         var activeImage = $('img.activeGalleryImg', gallery);
         activeImage.remove();

      // Add prev/next anchors if they haven't been made yet
         if(domGallery.indexActiveImage == -1)
         {
      		var domPrevImage = document.createElement('a');
      		domPrevImage.innerHTML = this.aLangs.prevImage;
      		domPrevImage.href = '';
      		domPrevImage.className = 'galleryNav';
            domPrevImage.direction = this.PREV;
      		domGallery.appendChild(domPrevImage);

      		var domNextImage = document.createElement('a');
      		domNextImage.innerHTML = this.aLangs.nextImage;
      		domNextImage.href = '';
      		domNextImage.className = 'galleryNav';
            domNextImage.direction = this.NEXT;
      		domGallery.appendChild(domNextImage);
         }

      // Set gallery's indexActiveImage
         domGallery.indexActiveImage = domTarget.index;

      // Make new activeGalleryImg
         var domActiveImage = document.createElement('img');
         domActiveImage.src = src;
         domActiveImage.className = 'activeGalleryImg';
         domGallery.appendChild(domActiveImage);
         break;

         case 'a':
      // Get gallery div of anchor
         var gallery = $(domTarget).parents('div.gallery');
         var domGallery = gallery.get(0);

      // Remove existing activeImage
         var activeImage = $('img.activeGalleryImg', gallery);
         activeImage.remove();

      // Find new indexActiveImage
         domGallery.indexActiveImage += domTarget.direction;
         if(domGallery.indexActiveImage >= domGallery.numImages)
         {
            domGallery.indexActiveImage = domGallery.numImages - 1;
         }
         else if(domGallery.indexActiveImage < 0)
         {
            domGallery.indexActiveImage = 0;
         }

      // Make new activeGalleryImg
         var domActiveImage = document.createElement('img');
         domActiveImage.src = domGallery.aImageSrc[domGallery.indexActiveImage];
         domActiveImage.className = 'activeGalleryImg';
         domGallery.appendChild(domActiveImage);
         break;

         default:
         break;
      }
   },

   DeletePost: function(subject, postURL)
   {
   // Get delete confirmation
      if(!confirm(this.aLangs.delPost + ' \'' + subject + '\'?'))
      {
         return;
      }

   // Create a form to confirm delete
      var domForm = document.createElement('form');
      domForm.action = postURL;
      domForm.method = 'post';
      domForm.style.position = 'absolute';
      domForm.style.visibility = 'hidden';

      var domConfirm = document.createElement('input');
      domConfirm.type = 'hidden';
      domConfirm.name = 'delete';
      domConfirm.value = 'true';
      domForm.appendChild(domConfirm);

   // Add form and submit it after a slight delay (hack)
      document.body.appendChild(domForm);

      setTimeout(function()
      {
         domForm.submit();
      }, 100);

      return;
   },

   Share: function(type)
   {
      switch(type)
      {
         case 'facebook':
         window.open('http://www.facebook.com/sharer.php?u=' + encodeURIComponent(this.shareURL) + '&t=' + encodeURIComponent(this.shareTitle), 'sharer', 'toolbar=0,status=0,width=626,height=436');
         break;

         case 'myspace':
         window.open('http://www.myspace.com/index.cfm?fuseaction=postto&t=' + encodeURIComponent(this.shareTitle) + '&c=&u=' + encodeURIComponent(this.shareURL) + '&l=', 'PostToMyspace', 'toolbar=0,status=0,width=800,height=650');
         break;

         case 'linkedin':
         window.open('http://www.linkedin.com/shareArticle?mini=true&url=' + encodeURIComponent(this.shareURL) + '&title=' + encodeURIComponent(this.shareTitle) + '&summary=&source=', 'share', 'toolbar=0,status=0,width=626,height=436');
         break;

         case 'twitter':
         window.open('http://twitter.com/home?status=' + encodeURIComponent(this.shareURL), 'share', 'toolbar=0,status=0,width=626,height=436');
         break;

         default:
         break;
      };
   },

   UpdateComments: function(data)
   {
		var error = $('error', data);

	//	Remove previous errors
		var domError = document.getElementById('errorSpan');
      domError.remove();

	//	Errors in submitted comment
		if(error.length > 0)
		{
			var errorId = $('error-id', error).text();
			var errorMsg = $('error-message', error).text();

			domError = document.createElement('span');
			domError.setAttribute('class', 'error');
			domError.setAttribute('id', 'errorSpan');

			if(errorMsg == 'author')
			{
			//	Error in posted author value (happens when not logged in)
				domError.innerHTML = this.aLangs.authorError;
				var domAuthorInput = document.getElementById('authorInput');

         // Insert error message
            $(domAuthorInput).insertBefore(domError);

			//	Focus on domAuthorInput
				domAuthorInput.focus();
			}
			else if(errorMsg == 'message')
			{
			//	Error in posted message
				domError.innerHTML = this.aLangs.commentError;

            var domComment;
				if(document.getElementById('messageEditor'))
            {
					domComment = document.getElementById('messageEditor');
            }
				else
            {
					domComment = document.getElementById('msgInput');
            }

         // Insert error message
            $(domComment).insertBefore(domError);
			}
			else if(errorMsg = 'codeInput')
			{
         // Captcha code error
				domError.innerHTML = this.aLangs.codeError;
				var domCaptchaInput = document.getElementById('codeInput');

         // Insert error message
				$(domCaptcha).insertBefore(domError);

         // Refresh captcha image
				document.getElementById('codeImage').src = blogLocation + '?Captcha&'+ new Date().getTime();

			//	Focus on captcha input
				domCaptchaInput.focus();
			}
		}
		else
		{
		//	Clear the message textarea if last action was a submit
			if(lastAction == 'add')
			{
				if(document.getElementById('messageEditorIframe'))
            {
					document.getElementById('messageEditorIframe').contentWindow.document.body.innerHTML = '';
            }
				if(document.getElementById('msgInput'))
            {
					document.getElementById('msgInput').value = '';
            }
				if( document.getElementById('codeInput'))
            {
					document.getElementById('codeInput').value = '';
            }
			}
			else	//	reset value of submit
         {
				document.getElementById('submit').value = 'add';
         }

		//	Empty commentBlock contents
         this.domCommentBlock.innerHTML = '';

		//	Loop through comments and add them to HTML
			var comments = xmlResponse.getElementsByTagName('comment');
			for(var i = comments.length - 1; i >= 0; i--)
			{
				var newComment = document.createElement('div');

				var commentId = comments[i].getAttribute('commentid');
				var author = comments[i].getElementsByTagName('author');
				author = author[0].firstChild.data;

				var timestamp = comments[i].getElementsByTagName('timestamp');
				timestamp = timestamp[0].firstChild.data;

				var message = comments[i].getElementsByTagName('message');
				message = message[0].firstChild.data;

				var preview = comments[i].getAttribute('preview');

				newComment.innerHTML = '<h5 class="time">' + langPostedBy + ' ' + author + ' ' + timestamp + '</h5><p class="commentText">' + message + '</p>';

				if(allowDelComment && preview != 'true')
            {
					newComment.innerHTML += '<a class="delCommentAnchor" onclick="return DeleteComment(' + postId + ', ' + commentId + ');" href="index.php?page=DeleteCommentXML&amp;blog=' + blogLocation + '&amp;post=' + postId + '&amp;comment=' + commentId + '">' + this.aLangs.langDelete + '</a>';
            }

				newComment.className = 'comment';
				commentBlock.appendChild(newComment);
			}

		//	Change number of comments
			document.getElementById('commentCntAnchor').innerHTML = langComments + '(' + comments.length + ')';
      }
   },

   AddComment: function(message)
   {
   },

   PreviewComment: function(message)
   {
   },

   DeleteComment: function(commentId)
   {
   	if(confirm(this.aLangs.delComment + '?'))
   	{
         var This = this;
         jQuery.post(this.blogLocation + '?DeleteCommentXML&post=' + this.postId, {comment:commentId}, This.UpdateComments);
   	}

   	return false;
   }
};

// Helper function to bypass IE handling of Flash objects
function WriteFlash(txtObject)
{
   document.write(txtObject);
}
