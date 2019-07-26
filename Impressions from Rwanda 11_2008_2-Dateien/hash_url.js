// Rewriting index frame hash to go directly to specific post(s)

var redirecter;

$(document).ready(function()
{
   redirecter = new HashRedirecter();
});

function HashRedirecter()
{
   this.domFrame = document.getElementById('mainFrame');

// Extract src from frame src
   this.srcOriginal = this.domFrame.src;
   var aMatches = this.srcOriginal.match(/iloapp\.([^\/]+)\/blog\/([^\?\#]+)/);
//   var aMatches = this.srcOriginal.match(/([^\/]+)\/blog\/([^\?\#]+)/);
   if(aMatches)
   {
      this.domain = aMatches[1];
      this.blogLocation = aMatches[2];
   }
   else
   {
      return;
   }

// Update frame for the first time
   this.UpdateFrame();

// Begin interval
   var This = this;
   setInterval(function()
   {
      This.UpdateFrame();
   }, 500);
}

HashRedirecter.prototype =
{
   hashCurrent: '',

   UpdateFrame: function()
   {
      if(this.hashCurrent != location.hash)
      {
         var txtBlogSrc = 'http://iloapp.' + this.domain + '/blog/' + this.blogLocation + '?';
//         var txtBlogSrc = 'http://' + this.domain + '/blog/' + this.blogLocation + '?';

         if(location.hash == '#home')
         {
         // Requesting home page
            this.domFrame.src = txtBlogSrc + 'Home';
         }
         else
         {
            aMatches = location.hash.match(/^#(post|comments|category|user)?(\d+)(?:\.(\d+))?/);
            if(aMatches)
            {
               var field = aMatches[1];
               var id = aMatches[2];

               if(field == 'comments')
               {
               // Set frame src
                  this.domFrame.src = txtBlogSrc + 'NewComment&post=' + id + '#niceURL';
               }
               else if(field == 'post' || field == 'category' || field == 'user')
               {
               // Set frame src
                  this.domFrame.src = txtBlogSrc + 'Home&' + field + '=' + id + '#niceURL';
               }
            }
         }

         this.hashCurrent = location.hash;
      }
      else
      {
      // Check if cookie contains a message
         var aMatches = document.cookie.match(/\bbmsg(\d+)=([^;]+)/);
         if(aMatches)
         {
            var blogId = aMatches[1];
            var message = aMatches[2];

         // Delete the cookie
            var expires = new Date(0);
            document.cookie = 'bmsg' + blogId + '=_;path=/;domain=.' + this.domain + ';expires=' + expires.toGMTString();
//            document.cookie = 'bmsg' + blogId + '=_;path=/;expires=' + expires.toGMTString();

         // Set hash according to message
            location.hash = '#' + message;
            this.hashCurrent = location.hash;
         }
      }
   }
}
