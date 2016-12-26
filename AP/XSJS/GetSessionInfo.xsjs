var body = '';
    body = JSON.stringify({
        "session": [{
        
          //$.session.getUsername() - Returns the user name of the logged-on database user
          "UserName": $.session.getUsername(),
        
         //$.session.language - Contains an empty string unless a language is explicitly set by the XS session layer.
         "Language": $.session.language,
        
         //$.session.getInvocationCount() - Returns the number of requests sent to the current session
         "InvocationCount": $.session.getInvocationCount(),
        
         //$.session.hasSystemPrivilege(privilegeName) - Checks whether the logged-on user has a specified system privilege
         "HasCreateSchemaPrivilege": $.session.hasSystemPrivilege("CREATE SCHEMA"),
        
         //$.session.getSecurityToken() - Returns unique session-specific token that could be used for XSRF prevention
         "SecurityToken": $.session.getSecurityToken()
        }]
    });
    $.response.contentType = 'application/json';
    $.response.setBody(body);
    $.response.status = $.net.http.OK;