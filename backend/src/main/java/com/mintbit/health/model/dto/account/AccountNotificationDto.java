package com.mintbit.health.model.dto.account;

import lombok.Data;

@Data
public class AccountNotificationDto {

    private String id;
    private String type;
    private String status;
    private String title;
    private String preview;
    private String body;
    private String relativeTime;
    private String actionHref;
}
