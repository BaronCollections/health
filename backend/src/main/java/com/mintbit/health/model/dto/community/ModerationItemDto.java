package com.mintbit.health.model.dto.community;

import lombok.Data;

@Data
public class ModerationItemDto {

    private String id;
    private String targetId;
    private String targetType;
    private String authorName;
    private String authorAvatar;
    private String circleName;
    private String currentStatus;
    private String relativeTime;
    private String contentPreview;
    private String moderationReason;
}
