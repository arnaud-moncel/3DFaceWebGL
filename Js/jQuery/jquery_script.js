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

    var slideCutOffDef =
    {
        min: -360,
        max: 360,
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

    var slideRoughnessDef =
    {
        min: 0,
        max: 0.3,
        values: 0,
        step: 0.001
    };

    var slideIndiceOfRefractionDef =
    {
        min: 0,
        max: 5,
        values: 0,
        step: 0.01
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
            //Update the label during the slide and update the lightDir value
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

    var slideFuncLightCutOff =
    {
        slide: function(event, ui)
        {
            $("#lightCutOff").val(ui.value);
            lightCutoffHtml[$("input.lightSelectedStr").val()-1] = ui.values;
        }
    };

    var slideFuncLightAmb =
    {
        slide: function(event, ui)
        {
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

    var slideFuncMaterialAmb =
    {
        slide: function(event, ui)
        {
            if(this.id == "sliderMaterialAmbR")
            {
                $("#materialAmbR").val(ui.value);
                materialAmbientHtml[0] = ui.value;
            }
            else if(this.id == "sliderMaterialAmbG")
            {
                $("#materialAmbG").val(ui.value);
                materialAmbientHtml[1] = ui.value;
            }
            else if(this.id == "sliderMaterialAmbB")
            {
                $("#materialAmbB").val(ui.value);
                materialAmbientHtml[2] = ui.value;
            }
        }
    };

    var slideFuncMaterialDif =
    {
        slide: function(event, ui)
        {
            if(this.id == "sliderMaterialDifR")
            {
                $("#materialDifR").val(ui.value);
                materialDiffuseHtml[0] = ui.value;
            }
            else if(this.id == "sliderMaterialDifG")
            {
                $("#materialDifG").val(ui.value);
                materialDiffuseHtml[1] = ui.value;
            }
            else if(this.id == "sliderMaterialDifB")
            {
                $("#materialDifB").val(ui.value);
                materialDiffuseHtml[2] = ui.value;
            }
        }
    };

    var slideFuncMaterialSpec =
    {
        slide: function(event, ui)
        {
            if(this.id == "sliderMaterialSpecR")
            {
                $("#materialSpecR").val(ui.value);
                materialSpecularHtml[0] = ui.value;
            }
            else if(this.id == "sliderMaterialSpecG")
            {
                $("#materialSpecG").val(ui.value);
                materialSpecularHtml[1] = ui.value;
            }
            else if(this.id == "sliderMaterialSpecB")
            {
                $("#materialSpecB").val(ui.value);
                materialSpecularHtml[2] = ui.value;
            }
        }
    };

    var slideFuncRoughness =
    {
        slide: function(event, ui)
        {
            $("#roughness").val(ui.value);
            roughnessHtml = ui.value;
        }
    };

    var slideFuncIndiceOfRefraction =
    {
        slide: function(event, ui)
        {
            $("#indiceOfRefraction").val(ui.value);
            indiceOfRefractionHtml = ui.value;
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

    //The CutOff slider
    $("div.classSliderLightCutOff").slider(slideCutOffDef);
    $("div.classSliderLightCutOff").slider("option", slideFuncLightCutOff);

    //The sliderLightAmb
    $("div.sliderLightAmb").slider(slideColDef);
    $("div.sliderLightAmb").slider("option", slideFuncLightAmb);

    //The sliderLightDif
    $("div.sliderLightDif").slider(slideColDef);
    $("div.sliderLightDif").slider("option", slideFuncLightDif);

    //The sliderLightSpec
    $("div.sliderLightSpec").slider(slideColDef);
    $("div.sliderLightSpec").slider("option", slideFuncLightSpec);

    //The sliderMaterialAmb
    $("div.sliderMaterialAmb").slider(slideColDef);
    $("div.sliderMaterialAmb").slider("option", slideFuncMaterialAmb);

    //The sliderMaterialDif
    $("div.sliderMaterialDif").slider(slideColDef);
    $("div.sliderMaterialDif").slider("option", slideFuncMaterialDif);

    //The sliderMaterialSpec
    $("div.sliderMaterialSpec").slider(slideColDef);
    $("div.sliderMaterialSpec").slider("option", slideFuncMaterialSpec);

    //The roughnessSlider
    $("div.classSliderRoughness").slider(slideRoughnessDef);
    $("div.classSliderRoughness").slider("option", slideFuncRoughness);

    //The indiceOfRefractionSlider
    $("div.classSliderIndiceOfRefraction").slider(slideIndiceOfRefractionDef);
    $("div.classSliderIndiceOfRefraction").slider("option", slideFuncIndiceOfRefraction);


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

    $("#popupMaterialColorActivator").click(
        function()
        {
            $("#popupMaterialColor").dialog("open");
        });

    $("#popupOtherActivator").click(
        function()
        {
           $("#popupOther").dialog("open");
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

    $("#illuminationModel").click(
        function()
        {
                phongHtml = $("#illuminationModel").val() == "Phong" ? 1:0;
        });




    /**
     *  FUNCTIONS
     */
        //Set the sliderPos value on the light selected value
    function setSliderValue()
    {
        $("input.lightSelectedStr").val($("#lightSelected").val());

        $("#sliderLightPosX").slider("value", lightPosHtml[$("input.lightSelectedStr").val()-1][0]);
        $("#sliderLightPosY").slider("value", lightPosHtml[$("input.lightSelectedStr").val()-1][1]);
        $("#sliderLightPosZ").slider("value", lightPosHtml[$("input.lightSelectedStr").val()-1][2]);

        $("#sliderLightDirX").slider("value", lightDirHtml[$("input.lightSelectedStr").val()-1][0]);
        $("#sliderLightDirY").slider("value", lightDirHtml[$("input.lightSelectedStr").val()-1][1]);
        $("#sliderLightDirZ").slider("value", lightDirHtml[$("input.lightSelectedStr").val()-1][2]);

        $("#sliderLightCutOff").slider("value", lightCutoffHtml[$("input.lightSelectedStr").val()-1]);


        //For the light Color
        $("#sliderLightAmbR").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][0][0]);
        $("#sliderLightAmbG").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][0][1]);
        $("#sliderLightAmbB").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][0][2]);

        $("#sliderLightDifR").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][1][0]);
        $("#sliderLightDifG").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][1][1]);
        $("#sliderLightDifB").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][1][2]);

        $("#sliderLightSpecR").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][2][0]);
        $("#sliderLightSpecG").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][2][1]);
        $("#sliderLightSpecB").slider("value", lightColorHtml[$("input.lightSelectedStr").val()-1][2][2]);
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

        $("#lightCutOff").val($("#sliderLightCutOff").slider("value"));


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

    function firstInit()
    {
        //first init of the select model
        $("#illuminationModel").val(phongHtml == 1 ? "Phong":"Cook Torrance");

        //First init of the material slider Color
        $("#sliderMaterialAmbR").slider("value", materialAmbientHtml[0]);
        $("#sliderMaterialAmbG").slider("value", materialAmbientHtml[1]);
        $("#sliderMaterialAmbB").slider("value", materialAmbientHtml[2]);

        $("#sliderMaterialDifR").slider("value", materialDiffuseHtml[0]);
        $("#sliderMaterialDifG").slider("value", materialDiffuseHtml[1]);
        $("#sliderMaterialDifB").slider("value", materialDiffuseHtml[2]);

        $("#sliderMaterialSpecR").slider("value", materialSpecularHtml[0]);
        $("#sliderMaterialSpecG").slider("value", materialSpecularHtml[1]);
        $("#sliderMaterialSpecB").slider("value", materialSpecularHtml[2]);

        //First init of the material label color
        $("#materialAmbR").val($("#sliderMaterialAmbR").slider("value"));
        $("#materialAmbG").val($("#sliderMaterialAmbG").slider("value"));
        $("#materialAmbB").val($("#sliderMaterialAmbB").slider("value"));

        $("#materialDifR").val($("#sliderMaterialDifR").slider("value"));
        $("#materialDifG").val($("#sliderMaterialDifG").slider("value"));
        $("#materialDifB").val($("#sliderMaterialDifB").slider("value"));

        $("#materialSpecR").val($("#sliderMaterialSpecR").slider("value"));
        $("#materialSpecG").val($("#sliderMaterialSpecG").slider("value"));
        $("#materialSpecB").val($("#sliderMaterialSpecB").slider("value"));

        $("#sliderRoughness").slider("value", roughnessHtml);
        $("#sliderIndiceOfRefraction").slider("value", indiceOfRefractionHtml);

        $("#roughness").val($("#sliderRoughness").slider("value"));
        $("#indiceOfRefraction").val($("#sliderIndiceOfRefraction").slider("value"));
    }
    firstInit();

});