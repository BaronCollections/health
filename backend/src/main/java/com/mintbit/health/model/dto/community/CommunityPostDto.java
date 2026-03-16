package com.mintbit.health.model.dto.community;

import lombok.Data;

import java.util.List;

@Data
public class CommunityPostDto {

    private String id;
    private String authorName;
    private String authorAvatar;
    private String authorRole;
    private Boolean viewerOwned;
    private String circleId;
    private String circleName;
    private String status;
    private String relativeTime;
    private String content;
    private List<String> tags;
    private List<String> images;
    private Integer likes;
    private Integer saves;
    private List<CommunityCommentDto> comments;
    private String moderationReason;
}
