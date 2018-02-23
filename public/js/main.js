$(document).ready(function(){

    $('.delete-book').on('click',function(e){

        $target=$(e.target);
        const id=$target.attr('book-id');
        $.ajax({

            type:'DELETE',
            url: '/book/delete/'+id,
            success: function(response){
                window.location.href='/'
            },
            error: function(err){
                console.log(err);
            }
        });
    });

});