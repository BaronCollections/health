package com.mintbit.health.model.dto.account;

import lombok.Data;

import java.util.Map;

@Data
public class AccountSecuritySnapshotDto {

    private String accountBinding;
    private String ocrAuthorization;
    private Map<String, Boolean> notificationPreferences;
}
