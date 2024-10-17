$(document).ready(function(){
	// The template code
	var templateSource = $("#results-template").html();

	// compile the template
	var template = Handlebars.compile(templateSource);

	// The div/container that we are going to display the results in
	var resultsPlaceholder = document.getElementById('content-placeholder');

	//

	var baseurl = $("#baseURL").val();
	$.getJSON(baseurl+'/mcx-user-registration/languages/en.json', function(data) {
		resultsPlaceholder.innerHTML = template(data);
		regBtnClickListeners();
	});


	// Register a helper
	Handlebars.registerHelper('set_msisdn', function(element){
		var msisdn = getCookie("msisdn");

		if(msisdn != null && msisdn.length != 0) {
			element.value = msisdn;
			//document.getElementById('loginForm').submit();

		}
	});

	// Register a helper
	Handlebars.registerHelper('set_firstName', function(element){
		var firstName = getCookie("firstName");

		if(msisdn != null && msisdn.length != 0) {
			element.value = firstName;
			//document.getElementById('loginForm').submit();

		}
	});
});

function setCookie(cname, cvalue, expirydays) {

	if (cvalue === null) {
        cvalue = document.getElementById('msisdn').value;
    }
	var date = new Date();
	date.setTime(date.getTime() + (expirydays * 24 * 60 * 60 * 1000));
	var expires = "expires=" + date.toGMTString();
	document.cookie = cname + "=" + cvalue + "; " + expires;
}

function getCookie(cname) {
	var name = cname + "=";
	var cookieArray = document.cookie.split(';');
	for(var i = 0; i < cookieArray.length; i++) {
		var cookie = cookieArray[i];
		while (cookie.charAt(0) == ' ') {
			cookie = cookie.substring(1);
		}
		if (cookie.indexOf(name) != -1) {
			return cookie.substring(name.length,cookie.length);
		}
	}
	return "";
}

function saveRequestDetails(msisdn) {
	var url = "/authenticationendpoint/mcx-user-registration/request/saveLoginDetails.jsp?msisdn=" + msisdn + "&requesttype=2";
	$.ajax({
		type: "GET",
		url: url,
		async:false,
	})
	/*.done(function (data) {
        json = $.parseJSON(data);
     });*/


	/**
	 log.info("url :" + url);
	 var xhr = new XMLHttpRequest();
	 xhr.open("GET", url,false);//async=false
	 xhr.send();
	 log.info("FFFFFFFFF : >" + xhr.responseText.toString());
	 var result = parse(xhr.responseText.toString());
	 return result.status;
	 */
}

function submitLoginForm() {
	if (true === $('#loginForm').parsley().isValid()) {
	    gaEventPush('enter_username');
		setCookie("msisdn", null, 1);
		document.getElementById('loginForm').submit();
	}
}

function howToLogin(locale) {
	window.location.href = "ssohelp2.jsp?locale="+locale;
}

function learnMore(locale) {
	window.location.href = "ssohelp.jsp?locale="+locale;
}

function noAccount() {
    gaEventPush('create_did_click');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=redirectToSignup";
	window.location = commonAuthURL;
}

function createID() {
    gaEventPush('create_did_click');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=redirectToSignup&backBehaviour=browser";
	window.location = commonAuthURL;
}

function createIdSilent() {
    gaEventPush('click_login');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=redirectToSignup&silentSignup=true&backBehaviour=browser";
	window.location = commonAuthURL;
}

function loginWithExistingAccount(existingMsisdn) {
    gaEventPush('click_login');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=loginWithExistingAccount&msisdn=" + existingMsisdn;
	window.location = commonAuthURL;
}

function crLoginWithExistingAccount(existingMsisdn) {
    gaEventPush('click_login');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=loginWithExistingAccount&crProcessed=true&msisdn=" + existingMsisdn;
	window.location = commonAuthURL;
}

function loginWithDifferentAccount() {
    gaEventPush('create_did_click');
	var sessionDataKey = qs('sessionDataKey');
	var commonAuthURL;
	commonAuthURL = "/commonauth/?sessionDataKey=" + sessionDataKey
		+ "&action=loginWithDifferentAccount";
	window.location = commonAuthURL;
}

function qs(key) {
	var vars = [], hash;
	var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
	for (var i = 0; i < hashes.length; i++) {
		hash = hashes[i].split('=');
		vars.push(hash[0]);
		vars[hash[0]] = hash[1];
	}
	return vars[key];
}

function regBtnClickListeners() {
	const siteMain = document.querySelector(".site__main");
	const buttons = siteMain.querySelectorAll("button");

	buttons.forEach(btn => {
		btn.addEventListener(
			'click',
			() => handleDisabledSate(buttons, btn),
			{ passive : true });
	});
}

function handleDisabledSate(buttons, clickedButton) {
	if (clickedButton.classList.contains("btn-submit") && false === $('#loginForm').parsley().isValid()) {
		return
	}

	buttons.forEach(btn => {
		btn.disabled = true
	});

	setTimeout(() => {
		buttons.forEach(btn => (btn.disabled = false));
	}, 15000)
}

function gaEventPush(eventName) {
    window.dataLayer = window.dataLayer || [];
    var msisdnParam = document.getElementById('msisdn').value;
    var msisdnType = '';
    var journeyType = getCookie('journey_type');
    if (journeyType === null || journeyType == ''){
        journeyType = 'No Header Enriched';
    }
    if ( msisdnParam !== 'null'){
        if (/^\d+$/.test(msisdnParam)) {
            msisdnType = 'Mobile';
        } else {
            msisdnType = 'Email';
        }
        if (journeyType.includes("Mobile") || journeyType.includes("Email")) {
            journeyType = journeyType.replace(/Mobile|Email/g, msisdnType);
        } else {
            journeyType += " - " + msisdnType;
        }
    }
    var referrerApp = getCookie('referrer_app');
    var encryptedMsisdn = getCookie('user_id');
    var advertisingId = getCookie('advertisingId');
    if (encryptedMsisdn !== 'null'){
        window.dataLayer.push({
            'event': eventName,
            'journey_type': journeyType,
            'advertising_id': advertisingId,
            'referrer_app': referrerApp,
            'user_id': encryptedMsisdn
        });
    } else {
        window.dataLayer.push({
            'event': eventName,
            'journey_type': journeyType,
            'advertising_id': advertisingId,
            'referrer_app': referrerApp
        });
    }
    setCookie("journey_type", journeyType, 1);
}