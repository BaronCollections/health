package com.mintbit.health.model.dto.account;

import lombok.Data;

import java.util.List;

@Data
public class NotificationListResponse {

    private String filter;
    private Integer unreadCount;
    private List<AccountNotificationDto> items;
}
