package com.mintbit.health.model.dto.account;

import lombok.Data;

import java.util.List;

@Data
public class NotificationReadRequest {

    private List<String> ids;
}
