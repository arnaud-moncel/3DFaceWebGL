/**
 * Created by arnaud on 23/04/14.
 */
$(function()
{
    /**
     *  DEF
     */
    //The slider definition
    var slideNumDef =
    {
        min: -100,
        max: 100,
        values: 0,
        step: 1
    };

    var slideColDef =
    {
        min: 0,
        max: 1,
        values: 0,
        step: 0.05
    };

    var slideFuncLightPos =
    {
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderLightPosX")
            {
                $("#lightPosX").val(ui.value);
                lightPosHtml[$("input.lightSelectedStr").val()-1][0] = ui.value;
            }
            else if(this.id == "sliderLightPosY")
            {
                $("#lightPosY").val(ui.value);
                lightPosHtml[$("input.lightSelectedStr").val()-1][1] = ui.value;
            }
            else if(this.id == "sliderLightPosZ")
            {
                $("#lightPosZ").val(ui.value);
                lightPosHtml[$("input.lightSelectedStr").val()-1][2] = ui.value;
            }
        }
    };

    var slideFuncLightDir =
    {
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderLightDirX")
            {
                $("#lightDirX").val(ui.value);
                lightDirHtml[$("input.lightSelectedStr").val()-1][0] = ui.value;
            }
            else if(this.id == "sliderLightDirY")
            {
                $("#lightDirY").val(ui.value);
                lightDirHtml[$("input.lightSelectedStr").val()-1][1] = ui.value;
            }
            else if(this.id == "sliderLightDirZ")
            {
                $("#lightDirZ").val(ui.value);
                lightDirHtml[$("input.lightSelectedStr").val()-1][2] = ui.value;
            }
        }
    };

        var slideFuncLightAmb =
    {
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderLightAmbR")
            {
                $("#lightAmbR").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][0][0] = ui.value;
            }
            else if(this.id == "sliderLightAmbG")
            {
                $("#lightAmbG").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][0][1] = ui.value;
            }
            else if(this.id == "sliderLightAmbB")
            {
                $("#lightAmbB").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][0][2] = ui.value;
            }
        }
    };

    var slideFuncLightDif =
    {
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderLightDifR")
            {
                $("#lightDifR").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][1][0] = ui.value;
            }
            else if(this.id == "sliderLightDifG")
            {
                $("#lightDifG").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][1][1] = ui.value;
            }
            else if(this.id == "sliderLightDifB")
            {
                $("#lightDifB").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][1][2] = ui.value;
            }
        }
    };

    var slideFuncLightSpec =
    {
        slide: function(event, ui)
        {
            //Update the label during the slide and update the lightPos value
            if(this.id == "sliderLightSpecR")
            {
                $("#lightSpecR").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][2][0] = ui.value;
            }
            else if(this.id == "sliderLightSpecG")
            {
                $("#lightSpecG").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][2][1] = ui.value;
            }
            else if(this.id == "sliderLightSpecB")
            {
                $("#lightSpecB").val(ui.value);
                lightColorHtml[$("input.lightSelectedStr").val()-1][2][2] = ui.value;
            }
        }
    };

    /**
     *  JQUERRY
     */
    //The sliderLightPosition
    $("div.sliderLightPos").slider(slideNumDef);
    $("div.sliderLightPos").slider("option", slideFuncLightPos);

    //The sliderLightDirection
    $("div.sliderLightDir").slider(slideNumDef);
    $("div.sliderLightDir").slider("option", slideFuncLightDir);

    //The sliderLightAmb
    $("div.sliderLightAmb").slider(slideColDef);
    $("div.sliderLightAmb").slider("option", slideFuncLightAmb);

    //The sliderLightDif
    $("div.sliderLightDif").slider(slideColDef);
    $("div.sliderLightDif").slider("option", slideFuncLightDif);

    //The sliderLightSpec
    $("div.sliderLightSpec").slider(slideColDef);
    $("div.sliderLightSpec").slider("option", slideFuncLightSpec);


    //The popup definition
    $("div.popup").dialog(
        {
            autoOpen: false,
            resizable: false,
            minWidth: 550
        });


    //Show popup only you click on the activator
    $("#popupLightPosActivator").click(
        function()
        {
            $("#popupLightPos").dialog("open");
        });

    $("#popupLightDirActivator").click(
        function()
        {
            $("#popupLightDir").dialog("open");
        });

    $("#popupLightColorActivator").click(
        function()
        {
            $("#popupLightColor").dialog("open");
        });


    //Do the function after when you selected a new light
    $("#lightSelected").click(
        function()
        {
            //Set the slider value on the light selected value
            setSliderValue();

            //Set the label value on the slider value
            setLabelValue();

            //Set value of the enableLightButton on the selected light
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
        //Set the sliderPos value on the light selected value
    function setSliderValue()
    {
        $("input.lightSelectedStr").val($("#lightSelected").val());

        $("#sliderLightPosX").slider("value", (lightPosHtml[$("input.lightSelectedStr").val()-1][0]));
        $("#sliderLightPosY").slider("value", (lightPosHtml[$("input.lightSelectedStr").val()-1][1]));
        $("#sliderLightPosZ").slider("value", (lightPosHtml[$("input.lightSelectedStr").val()-1][2]));

        $("#sliderLightDirX").slider("value", (lightDirHtml[$("input.lightSelectedStr").val()-1][0]));
        $("#sliderLightDirY").slider("value", (lightDirHtml[$("input.lightSelectedStr").val()-1][1]));
        $("#sliderLightDirZ").slider("value", (lightDirHtml[$("input.lightSelectedStr").val()-1][2]));


        //For the light Color
        $("#sliderLightAmbR").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][0][0]));
        $("#sliderLightAmbG").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][0][1]));
        $("#sliderLightAmbB").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][0][2]));

        $("#sliderLightDifR").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][1][0]));
        $("#sliderLightDifG").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][1][1]));
        $("#sliderLightDifB").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][1][2]));

        $("#sliderLightSpecR").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][2][0]));
        $("#sliderLightSpecG").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][2][1]));
        $("#sliderLightSpecB").slider("value", (lightColorHtml[$("input.lightSelectedStr").val()-1][2][2]));
    }
    setSliderValue();

    //Set the label value on the slider value
    function setLabelValue()
    {
        $("#lightPosX").val($("#sliderLightPosX").slider("value"));
        $("#lightPosY").val($("#sliderLightPosY").slider("value"));
        $("#lightPosZ").val($("#sliderLightPosZ").slider("value"));

        $("#lightDirX").val($("#sliderLightDirX").slider("value"));
        $("#lightDirY").val($("#sliderLightDirY").slider("value"));
        $("#lightDirZ").val($("#sliderLightDirZ").slider("value"));


        //For the light color
        $("#lightAmbR").val($("#sliderLightAmbR").slider("value"));
        $("#lightAmbG").val($("#sliderLightAmbG").slider("value"));
        $("#lightAmbB").val($("#sliderLightAmbB").slider("value"));

        $("#lightDifR").val($("#sliderLightDifR").slider("value"));
        $("#lightDifG").val($("#sliderLightDifG").slider("value"));
        $("#lightDifB").val($("#sliderLightDifB").slider("value"));

        $("#lightSpecR").val($("#sliderLightSpecR").slider("value"));
        $("#lightSpecG").val($("#sliderLightSpecG").slider("value"));
        $("#lightSpecB").val($("#sliderLightSpecB").slider("value"));
    }
    setLabelValue();

    //Set value of the enableLightButton on the selected light
    function setEnabledLight(b)
    {
        if(enabledLightHtml[$("input.lightSelectedStr").val()-1] == 1)
        {
            if(b)
                $("#enableLightButton").val("Enabled");
            else
            {
                enabledLightHtml[$("input.lightSelectedStr").val()-1] = 0;
                $("#enableLightButton").val("Disabled");
            }
        }
        else
        {
            if(b)
                $("#enableLightButton").val("Disabled");
            else
            {
                enabledLightHtml[$("input.lightSelectedStr").val()-1] = 1;
                $("#enableLightButton").val("Enabled");
            }
        }
    }
    setEnabledLight(true);


});