package com.isasigns.backend.service;

import java.util.Map;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.web.client.RestClient;

@Service
public class TwilioSmsDeliveryClient implements SmsDeliveryClient {
    private final RestClient restClient;
    private final String accountSid;
    private final String authToken;
    private final String fromNumber;

    public TwilioSmsDeliveryClient(
            RestClient.Builder restClientBuilder,
            @Value("${app.notifications.sms.twilio-account-sid:}") String accountSid,
            @Value("${app.notifications.sms.twilio-auth-token:}") String authToken,
            @Value("${app.notifications.sms.from-number:}") String fromNumber) {
        this.restClient = restClientBuilder.baseUrl("https://api.twilio.com").build();
        this.accountSid = accountSid;
        this.authToken = authToken;
        this.fromNumber = fromNumber;
    }

    @Override
    public String send(String recipient, String body) {
        var form = new LinkedMultiValueMap<String, String>();
        form.add("To", recipient);
        form.add("From", fromNumber);
        form.add("Body", body);

        @SuppressWarnings("unchecked")
        Map<String, Object> response = restClient.post()
                .uri("/2010-04-01/Accounts/{accountSid}/Messages.json", accountSid)
                .headers(headers -> headers.setBasicAuth(accountSid, authToken))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .body(form)
                .retrieve()
                .body(Map.class);

        Object sid = response == null ? null : response.get("sid");
        return sid == null ? null : sid.toString();
    }
}
