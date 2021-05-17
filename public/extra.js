<% if(request.status != 'Approved') {%> 
    <div class="card-body">
        <form class="d-inline" action="/request/<%= request._id %>?_method=DELETE" method='POST'>
            <button class="btn btn-danger">Cancel</button>
        </form>
      </div>
    <% } %> 