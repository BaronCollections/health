package com.mintbit.health.model.dto.community;

import lombok.Data;

@Data
public class CommunityCommentDto {

    private String id;
    private String authorName;
    private String authorAvatar;
    private String authorRole;
    private Boolean viewerOwned;
    private String status;
    private String relativeTime;
    private String content;
    private Integer likes;
    private String moderationReason;
}
