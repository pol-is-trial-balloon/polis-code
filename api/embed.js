(function() {
  var firstRun = !window.polis;
  window.polis = window.polis || {};

  function getConfig(d) {
     return {
         conversation_id: d.getAttribute("data-conversation_id"),
         site_id: d.getAttribute("data-site_id"),
         page_id: d.getAttribute("data-page_id"),
         parent_url: d.getAttribute("data-parent_url"),
         border: d.getAttribute("data-border"),
         border_radius: d.getAttribute("data-border_radius"),
         height: d.getAttribute("data-height"),
         demo: d.getAttribute("data-demo")
     };
  }

  function createPolisIframe(parent, o) {
    var iframe = document.createElement("iframe");
    var path = [];
    if (o.demo) {
      path.push("demo");
    }
    o.parent_url = o.parent_url || window.location+"";
    if (o.conversation_id) {
      path.push(o.conversation_id);
    } else if (o.site_id) {
      path.push(o.site_id);
      if (!o.page_id) {
        alert("Error: need data-page_id when using data-site_id");
        return;
      }
      path.push(o.page_id);
    } else {
      alert("Error: need data-conversation_id or data-site_id");
      return;
    }
    var src = "https://preprod.pol.is/"+ path.join("/");
    var paramStrings = [];
    if (o.parent_url) {
      paramStrings.push("parent_url="+ encodeURIComponent(o.parent_url));
    }
    if (paramStrings.length) {
      src += "?" + paramStrings.join("&");
    }

    iframe.src = src;
    iframe.width = "100%"; // may be constrained by parent div
    iframe.height = o.height || 930;
    iframe.style.border = o.border || "1px solid #ccc";
    iframe.style.borderRadius = o.border_radius || "4px";
    parent.appendChild(iframe);
  }

  function cookiesEnabledAtTopLevel() {
    // create a temporary cookie 
    var soon = new Date(Date.now() + 1000).toUTCString();
    var teststring = "_polistest_cookiesenabled";
    document.cookie = teststring + "=1; expires=" + soon;  
    // see if it worked
    var cookieEnabled = document.cookie.indexOf(teststring) != -1;
    // clear the cookie
    document.cookie = teststring + "=; expires=" + (new Date(0)).toUTCString();  
    return cookieEnabled;
  }

  function encodeReturnUrl(str) {
    var x, i;
    var result = "";
    for (i=0; i<str.length; i++) {
      x = str.charCodeAt(i).toString(16);
      result += ("000"+x).slice(-4);
    }
    return result;
  }

  if (firstRun) {
    window.addEventListener("message", function(event) {
  
      if (!event.origin.match(/pol.is$/)) {
        return;
      } 
    
      if (event.data === "cookieRedirect" && cookiesEnabledAtTopLevel()) {
        // temporarily redirect to polis, which will set a cookie and redirect back
        window.location = "https://embed.pol.is/api/v3/launchPrep?dest=" + encodeReturnUrl(window.location+"");
      }
    }, false);
  }

  // Add iframes to any polis divs that don't already have iframes.
  // (check needed since this script may be included multiple times)
  var polisDivs = document.getElementsByClassName("polis");
  for (var i = 0; i < polisDivs.length; i++) {
      var d = polisDivs[i];
      if (d.children && d.children.length) {
          // already populated
      } else {
         var config = getConfig(d);
         createPolisIframe(d, config);
      }
  }
}());


