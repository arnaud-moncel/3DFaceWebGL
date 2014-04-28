/**
 * Created by arnaud on 23/04/14.
 */
$(function()
{
    /**
     *  JQUERRY
     */
    //The slider definition


    $("div.sliderPos").slider({
        min: -100,
        max: 100,
        values: 0,
        step: 1,
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
    $("#popupLightPosActivator").click(
        function()
        {
            $("#popup").dialog("open");
        });

    //Do the function after when you selected a new light
    $("#lightSelected").click(
        function()
        {
            //Set the slider value on the light selected value
            setSliderValue();

            //Set the label value on the slider value
            setLabelValue();

            //set value of the enableLightButton on the selected light
            setEnabledLight(true);
        });

    //Change the light state when you click on the enableLightButton
    $("#enableLightButton").click(
        function()
        {
            //Change the state of the light
            setEnabledLight(false);
        });




    /**
     *  FUNCTIONS
     */
    function setSliderValue()
    {
        $("#lightSelectedStr").val($("#lightSelected").val());

        //Set the slider value on the light selected value
        $("#sliderX").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][0]));
        $("#sliderY").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][1]));
        $("#sliderZ").slider("value", (lightPosHtml[$("#lightSelectedStr").val()-1][2]));
    }
    setSliderValue();

    //Set the label value on the slider value
    function setLabelValue()
    {
        $("#lightPosX").val($("#sliderX").slider("value"));
        $("#lightPosY").val($("#sliderY").slider("value"));
        $("#lightPosZ").val($("#sliderZ").slider("value"));
    }
    setLabelValue();

    //set value of the enableLightButton on the selected light
    function setEnabledLight(b)
    {
        if(enabledLightHtml[$("#lightSelectedStr").val()-1] == 1)
        {
            if(b)
                $("#enableLightButton").val("Enabled");
            else
            {
                enabledLightHtml[$("#lightSelectedStr").val()-1] = 0;
                $("#enableLightButton").val("Disabled");
            }
        }
        else
        {
            if(b)
                $("#enableLightButton").val("Disabled");
            else
            {
                enabledLightHtml[$("#lightSelectedStr").val()-1] = 1;
                $("#enableLightButton").val("Enabled");
            }
        }
    }
    setEnabledLight(true);


});