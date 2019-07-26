$(document).ready(function()
{
// Extract domain name and blog location
   var domain, blogLocation = '';
   var txtLocation = new String(location);
   var txtHash = location.hash;

   var aMatches = txtLocation.match(/iloapp\.([^\/]+?)\/blog\/([^\?\/\#]+)/);
   if(aMatches)
   {
      domain = aMatches[1];
      blogLocation = aMatches[2];
   }
   else
   {
      return;
   }

   if(top == window)
   {
   // Not inside the frame, let's redirect
      var txtRedirect = 'http://' + blogLocation + '.' + domain + '/';

      aMatches = txtLocation.match(/Home(?:&(post|category|user)=(\d+))?/);
      if(aMatches)
      {
         if(aMatches[1] != null && aMatches[2] != null)
         {
            txtRedirect += '#' + aMatches[1] + aMatches[2];
         }
         location = txtRedirect;
      }
   }
   else
   {
   // Check if this is Safari and change all comment links to target=_top
      if(jQuery.browser.safari)
      {
         $('a.commentAnchor').attr('target', '_top');
      }
   }
});

function WriteFlash(txtObject)
{
   document.write(txtObject);
}
