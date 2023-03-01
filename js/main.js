// Author Mohamed Zurfudeen - RazuInfotech
// Created for Metro Dental

(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Sticky Navbar
    $(window).scroll(function () {
        if ($(this).scrollTop() > 40) {
            $('.navbar').addClass('sticky-top');
        } else {
            $('.navbar').removeClass('sticky-top');
        }
    });
    
    // Dropdown on mouse hover
    const $dropdown = $(".dropdown");
    const $dropdownToggle = $(".dropdown-toggle");
    const $dropdownMenu = $(".dropdown-menu");
    const showClass = "show";
    
    $(window).on("load resize", function() {
        if (this.matchMedia("(min-width: 992px)").matches) {
            $dropdown.hover(
            function() {
                const $this = $(this);
                $this.addClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "true");
                $this.find($dropdownMenu).addClass(showClass);
            },
            function() {
                const $this = $(this);
                $this.removeClass(showClass);
                $this.find($dropdownToggle).attr("aria-expanded", "false");
                $this.find($dropdownMenu).removeClass(showClass);
            }
            );
        } else {
            $dropdown.off("mouseenter mouseleave");
        }
    });
    
    
    // Back to top button
    $(window).scroll(function () {
        if ($(this).scrollTop() > 100) {
            $('.back-to-top').fadeIn('slow');
        } else {
            $('.back-to-top').fadeOut('slow');
        }
    });
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });


    // Date and time picker
    $('.date').datetimepicker({
        format: 'L'
    });
    $('.time').datetimepicker({
        format: 'LT'
    });


    // Image comparison
    $(".twentytwenty-container").twentytwenty({});


    // Price carousel
    $(".price-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1500,
        margin: 45,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
        responsive: {
            0:{
                items:1
            },
            768:{
                items:2
            }
        }
    });


    // Testimonials carousel
    $(".testimonial-carousel").owlCarousel({
        autoplay: true,
        smartSpeed: 1000,
        items: 1,
        dots: false,
        loop: true,
        nav : true,
        navText : [
            '<i class="bi bi-arrow-left"></i>',
            '<i class="bi bi-arrow-right"></i>'
        ],
    });

    //Record Data to the LS

    //Var Declaration
    var savedData;
	var flag;
    var id;
    var message;
    var editId;
    var deleteId;
    $("#confirmation").hide();
    $("#DataStat").hide();
    $("#NostatusDataContainer").hide();
    //Collect Data Values
    $("#record").click(function(e){
        //e.preventDefault();
        var name = $("#name").val();
        var phone = $("#phone").val();
        var item = $("#item").val();
        var branch= $("#branch").val();
        var status= $("#status").val();
        var date= $("#date").val();
        
        //Check the Filled Datas

        if(name!=="" && phone!=="" && item!=="" && branch!=="" && status!=="" && date!==""){
            //Check the LS compatability
            if (typeof(Storage) !== "undefined") {
                let allusers =  localStorage.getItem("Users") || '[]'; // Check the Length 
                allusers = JSON.parse(allusers); //Parse the Stringify data
                // Setting Id for the Datas
                var oldlength = allusers.length;
                if(oldlength > 0){
                    id = oldlength+1;
                } else {
                    id=1;
                }
               
                if(flag==0){
                    editId = +editId
    
                    allusers.push({ SNo:editId, Name: name, Mobile: phone, Item:item,Branch:branch,Status:status,Date:date });
                   
                } else {
                    //alert(typeof(id));
                    allusers.push({ SNo:id, Name: name, Mobile: phone, Item:item,Branch:branch,Status:status,Date:date });
                }
                
                //Store the values in LS
                localStorage.setItem("Users", JSON.stringify(allusers));
                $("#viewRecordBut").hide();
                if(flag==0){
                    deleteRecords(allusers,editId);
                }
                
                if(status=="OrderPlaced"){
                    //alert(status)
                    message = "Dr. Ameerdeen, The patient "+name+"'s "+item+" order has been placed on "+date;
                } else if(status=="OrderReceived"){
                    //alert(status)
                    message = "Dr. Ameerdeen, The  "+item+" we ordered for "+name+" has been Received on "+date;
                }
                //alert(message);
                 $("#confirmation").show(1500,function(){
                     window.open("https://api.whatsapp.com/send?phone=919003956323&text="+encodeURI(message)+"&type=phone_number&app_absent=0");
                    location.reload();
                 });  
            } else {

            }
        }
    });

    //populate data

    $("#ViewRecords").click(function(){
        $("#DataStat").show();
        //$("html, body").animate({ scrollTop: $('#DataStat').offset().top }, 1500);
        savedData = JSON.parse(localStorage.getItem("Users"));
        if(savedData!==null&&savedData.length>0){
            var template='<div class="innerpopulate">';
            savedData.forEach(Users => {
                template+='<div class="row gx-5"><div class="col-lg-12">';
                template+='<div class="col-lg-2 popcon">'+Users.Name+'</div>';
                template+='<div class="col-lg-2 popcon">'+Users.Mobile+'</div>';
                template+='<div class="col-lg-2 popcon">'+Users.Item+'</div>';
                template+='<div class="col-lg-2 popcon">'+Users.Branch+'</div>';
                template+='<div class="col-lg-2 popcon">'+Users.Status+'</div>';
                template+='<div class="col-lg-2 popcon">'+Users.Date+'<span class="sym"><i class="fas fa-edit" data-id="'+Users.SNo+'"></i></span><span class="sym"><i class="fa fa-trash" data-id="'+Users.SNo+'" aria-hidden="true"></i></span></div></div></div>';
            })
            template+='</div';
            $("#statusDataContainer").html(template);
        } else{
            $("#NostatusDataContainer").show();   
        }
    })

    //Edit Functionality
    $("body").on("click",'i.fa-edit',function(){    
        editId=$(this).attr("data-id");
        $("#name").val(savedData[editId-1].Name);
        $("#phone").val(savedData[editId-1].Mobile);
        $("#item").val(savedData[editId-1].Item);
        $("#branch").val(savedData[editId-1].Branch);
        $("#status").val(savedData[editId-1].Status); 	
        $("#date").val(savedData[editId-1].Date);	
        $("html, body").animate({ scrollTop: $('#OrderContainer').offset().top }, 900,"linear");		 
        flag=0;
    });
    //Delete Records
    function deleteRecords(data,id){
        data.splice(id-1,1);
        data = data.sort((a, b) => parseInt(a.SNo) - parseInt(b.SNo));
        localStorage.setItem("Users", JSON.stringify(data));
        flag=1;
    }

    //Delete Records using Delete IconS

    $("body").on("click",'i.fa-trash',function(){
        let result = confirm("Are you sure want to delete?");
        if(result){
        deleteId = $(this).attr("data-id");
        savedData.splice(deleteId-1,1);
        for(var i=0;i<savedData.length;i++){
            savedData[i].SNo=i+1;
        }
        localStorage.setItem("Users", JSON.stringify(savedData));
        location.reload();
        }
        
     });


})(jQuery);

