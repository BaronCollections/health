package com.mintbit.health.model.dto.community;

import lombok.Data;

import java.util.List;

@Data
public class ModerationQueueResponse {

    private String status;
    private List<ModerationItemDto> items;
}
