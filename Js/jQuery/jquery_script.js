/**
 * Created by arnaud on 23/04/14.
 */
$(function()
{
    //The slider definition
    $("div.slider").slider({
        min: -100,
        max: 100,
        values: 0,
        step: 5,
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderX")
            {
                $("#lightPosX").val(ui.value);
                lightPosHtml[$("#lightSelectedStr").val()-1][0] = ui.value;
            }
            else if(this.id == "sliderY")
            {
                $("#lightPosY").val(ui.value);
                lightPosHtml[$("#lightSelectedStr").val()-1][1] = ui.value;
            }
            else if(this.id == "sliderZ")
            {
                $("#lightPosZ").val(ui.value);
                lightPosHtml[$("#lightSelectedStr").val()-1][2] = ui.value;
                console.log(lightPosHtml[$("#lightSelectedStr").val()-1][2]);
            }
        }
    });

    //the popup definition
    $("#popup").dialog(
        {
            autoOpen: false,
            minWidth: 550
        });

    //Show popup only you click on the activator
    $("#popupActivator").click(
        function()
        {
            $("#popup").dialog("open");
        });

    //Do the function after when you selected a new light
    $("#lightSelected").click(
        function()
        {
            $("#lightSelectedStr").val($("#lightSelected").val());

            //Set the slider value on the light selected value
            $("#sliderX").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][0]));
            $("#sliderY").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][1]));
            $("#sliderZ").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][2]));

            //Set the label value on the slider value
            $("#lightPosX").val($("#sliderX").slider("value"));
            $("#lightPosY").val($("#sliderY").slider("value"));
            $("#lightPosZ").val($("#sliderZ").slider("value"));
        });

    //For the first initialisation
    $("#lightSelectedStr").val($("#lightSelected").val());

    //Set the slider value on the light selected value
    $("#sliderX").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][0]));
    $("#sliderY").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][1]));
    $("#sliderZ").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][2]));

    //Set the label value on the slider value
    $("#lightPosX").val($("#sliderX").slider("value"));
    $("#lightPosY").val($("#sliderY").slider("value"));
    $("#lightPosZ").val($("#sliderZ").slider("value"));
});