uniform sampler2D subTexture;
uniform sampler2D sTexture;
uniform sampler2D rTexture;
uniform sampler2D gTexture;
uniform sampler2D bTexture;
uniform sampler2D specTexture;
uniform int enabledLights[8];
uniform float roughness;
uniform float indiceOfRefraction;
uniform int enableSelection;
uniform float selection[4];

varying vec2 texCoord;
varying vec3 lightsVec[8];
varying vec3 ecPosition;
varying vec3 normal;
varying mat3 tbn;


varying vec4 position;

float beckmann(	float cosalpha, float r )
{
        float res = 0.0;

	float m2 = r*r;
	float c2 = cosalpha*cosalpha;
        
	res = (exp( (c2-1.0) / (c2*m2))) / ( c2*c2*m2);

        return res;
}

float fresnelReflectance( float VdotH, float f )
{
	float base = 1.0-VdotH;
	float exponential = pow(base, 5.0);	
	return min(1,(exponential + f * (1.0 - exponential)));
}


float geomasking( float cos_theta_r, float cos_alpha, float cos_theta_i, float cos_beta )
{
        float res = 0.0;

	float shadowing = (cos_alpha * cos_theta_r) / cos_beta;
	float masking = (cos_alpha * cos_theta_i) / cos_beta;
	res = min(1.0, 2.0 * min( shadowing, masking));

        return res;
}

float geomasking2(float LdotN, float VdotN, float VdotH, float HdotN)
{	
	// VdotH should never be zero. Only possible if
	// L and V end up in the same plane (unlikely).
	float denom = max( VdotH, 1.192092896e-07 );	
										
	float numL = min(VdotN, LdotN);
	float numR = 2.0*HdotN;
	if((numL*numR) <= denom )
	{
		//numL = numL == VdotN ? 1.0 : (LdotN / VdotN);	// VdotN is > 0 if this division is used
		//return (numL*numR) / denom;
                return 1.0;
	}
	else{				
            return 1.0 / VdotN;
        }
}


float diffuse(vec3 Ln, vec3 Vf, vec3 Ns, vec3 ScannedNormal)
{
        float ns_dot_v = dot(Ns,Vf);
        float ns_dot_map = dot(Ns,ScannedNormal);
        float map_dot_v = dot(ScannedNormal,Vf);
        
        //float cos_theta_i = ( map_dot_v <= 0.0 && ns_dot_v >= 0.0) ? 0.0 : dot(Ln, ScannedNormal) ;
	//float cos_theta_i = ( ns_dot_map <= 0.0 && ns_dot_v >= 0.0) ? dot(Ln, Ns) : dot(Ln, ScannedNormal) ;
        float cos_theta_i = dot(Ln,ScannedNormal);
	return  cos_theta_i;
}

float specular(vec3 Ln, vec3 Vf, vec3 Ns, vec3 ScannedNormal, float r, float ior){
        float spec = 0.0;

        float cos_theta_i = 0.0;
        float cos_theta_r = 0.0;
        float cos_alpha = 0.0;
        float cos_beta = 0.0;
	float alpha = 0.0;
        float D = 0.0;
        float G = 0.0;
        float F = 0.0;

	vec3 Hn = normalize(Ln+Vf);
        float ns_dot_v = dot(Ns,Vf);
        float ns_dot_map = dot(Ns,ScannedNormal);

	// check orientation, use Ns if needed
	if (ns_dot_map <= 0.0 && ns_dot_v >= 0.0) {
		cos_theta_r = ns_dot_v;
		cos_theta_i = dot(Ln,Ns);
		cos_alpha = dot(Hn,Ns);
	} else {
		cos_theta_r = max( 0.00001, dot(Vf,ScannedNormal) );
		cos_theta_i = dot(Ln,ScannedNormal);
		cos_alpha = dot(Hn,ScannedNormal);
	}

        cos_beta = dot(Vf,Hn);

	D = beckmann( cos_alpha, r );
	//G = geomasking2(cos_theta_i, cos_theta_r, cos_beta, cos_alpha);
        G = geomasking( cos_theta_r, cos_alpha, cos_theta_i, cos_beta );
	F = fresnelReflectance( cos_beta, ior );

        spec = (F/3.14)*(D/cos_theta_i)*(G/cos_theta_r);

        return spec;
}

void main(void)
{
    vec3 snorm = texture2D(sTexture, texCoord.st).rgb;
    snorm  = snorm * 2.0 - 1.0;
    snorm = gl_NormalMatrix * snorm;
    //snorm = tbn * snorm;
    snorm = normalize(snorm);

    vec3 rnorm = texture2D(rTexture, texCoord.st).rgb;
    rnorm  = rnorm * 2.0 - 1.0;
    rnorm = gl_NormalMatrix * rnorm;
    //rnorm = tbn * rnorm;
    rnorm = normalize(rnorm);

    vec3 gnorm = texture2D(gTexture, texCoord.st).rgb;
    gnorm  = gnorm * 2.0 - 1.0;
    gnorm = gl_NormalMatrix * gnorm;
    //gnorm = tbn * gnorm;
    gnorm = normalize(gnorm);

    vec3 bnorm = texture2D(bTexture, texCoord.st).rgb;
    //bnorm  = bnorm * 2.0 - 1.0;
    bnorm = gl_NormalMatrix * bnorm;
    //bnorm = tbn * bnorm;
    bnorm = normalize(bnorm);

    vec3  texColor =  texture2D(subTexture, texCoord.st).rgb;
    texColor = pow(texColor,vec3(2.2));
    vec3  specTexColor = texture2D(specTexture, texCoord.st).rgb;
    specTexColor = pow(specTexColor,vec3(2.2));
   

    vec3 LightIntensity;
    vec3 reflectVec[8];
    float spec[8];
    vec3 diffuseCol[8];
    vec3 viewVec = normalize(-ecPosition);

    vec3 specComponent = vec3(0,0,0) ;
    vec3 diffComponent = vec3(0,0,0) ;
    vec3 ambComponent = vec3(0,0,0);

    int i = 0;
    float nbLights = 0.0;
    for( ; i < 7 ; i++){
        if( enabledLights[i] == 1){
            //reflectVec[i] = reflect(lightsVec[i], snorm);
            //reflectVec[i] = normalize(reflectVec[i]);
            //spec[i] = min(max(dot(reflectVec[i], viewVec), 0.0),1.0);

            //vec3 halfVector = normalize( lightsVec[i] + viewVec );
            //spec[i] = min(max(dot(snorm, halfVector), 0.0),1.0);

            spec[i]=specular(lightsVec[i], viewVec, normal , snorm, roughness, indiceOfRefraction);


            //spec[i] = pow(spec[i], gl_FrontMaterial.shininess);

            diffuseCol[i].r   = diffuse(lightsVec[i], viewVec , normal, rnorm);//min(max(dot(-lightsVec[i], rnorm), 0.0),1.0);
            diffuseCol[i].g   = diffuse(lightsVec[i], viewVec , normal, gnorm);//min(max(dot(-lightsVec[i], gnorm), 0.0),1.0);
            diffuseCol[i].b   = diffuse(lightsVec[i], viewVec , normal, bnorm);//min(max(dot(-lightsVec[i], bnorm), 0.0),1.0);

            specComponent += spec[i] * gl_LightSource[i].specular.rgb * gl_FrontMaterial.specular.rgb /* texColor.rgb */* specTexColor.rgb ;
            diffComponent +=  diffuseCol[i].rgb * gl_LightSource[i].diffuse.rgb * gl_FrontMaterial.diffuse.rgb* texColor.rgb ;
            ambComponent += gl_LightSource[i].ambient.rgb * gl_FrontMaterial.ambient.rgb * texColor.rgb;

            nbLights++;
        }
    }

    specComponent /= nbLights;
    diffComponent /= nbLights;
    specComponent /= nbLights;

    //The scanning light
    
    float spotDot = dot(-lightsVec[i],normalize(gl_LightSource[i].spotDirection));
    float cosDot = acos(spotDot);
    float spotCutoff = gl_LightSource[i].spotCutoff;
    if(cosDot < spotCutoff && enabledLights[i] == 1){

        //float dist = length(lightsVec[i]);
        //float attenuation = 1.0;// / ( dist * gl_LightSource[i].linearAttenuation + 
                                //    dist * dist * gl_LightSource[i].quadraticAttenuation );

        //reflectVec[i] = reflect(-lightsVec[i], snorm);
            //reflectVec[i] = normalize(reflectVec[i]);
            //spec[i] = min(max(dot(reflectVec[i], viewVec), 0.0),1.0);


            spec[i] = specular(lightsVec[i], viewVec, normal , snorm, roughness, indiceOfRefraction);

            //spec[i] = pow(spec[i], gl_FrontMaterial.shininess);


            diffuseCol[i].r   = max(dot(-lightsVec[i], rnorm), 0.0);
            diffuseCol[i].g   = max(dot(-lightsVec[i], gnorm), 0.0);
            diffuseCol[i].b   = max(dot(-lightsVec[i], bnorm), 0.0);

            specComponent += spec[i] * gl_LightSource[i].specular.rgb * gl_FrontMaterial.specular.rgb /* texColor.rgb*/ * specTexColor.rgb ;
            diffComponent += diffuseCol[i].rgb * gl_LightSource[i].diffuse.rgb* gl_FrontMaterial.diffuse.rgb* texColor.rgb  ;
            ambComponent += gl_LightSource[i].ambient.rgb * gl_FrontMaterial.ambient.rgb   ;
    }

    //LightIntensity = specComponent + diffComponent + ambComponent ;// specComponent;//+diffComponent+ambComponent;//mix( specComponent.rgb , diffComponent, ambComponent.rgb + gl_FrontMaterial.emission.rgb);
    LightIntensity =  0.5*diffComponent + 0.5*specComponent + ambComponent  ;

    LightIntensity = pow(LightIntensity, vec3(1.0/2.2));

/*if(enableSelection == 1){
        if(texCoord.s < selection[0] || texCoord.s > (selection[0]+selection[2])
           || (1.0-texCoord.t) <  selection[1] || (1.0-texCoord.t) > (selection[1]+selection[3] )){
            LightIntensity = 0.0 * LightIntensity;
        }
    }*/
    
    gl_FragColor = vec4 (LightIntensity, 1.0);
}
