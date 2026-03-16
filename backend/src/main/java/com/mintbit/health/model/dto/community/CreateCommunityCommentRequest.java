package com.mintbit.health.model.dto.community;

import lombok.Data;

@Data
public class CreateCommunityCommentRequest {

    private String content;
    private String authorName;
    private String authorAvatar;
    private String authorRole;
}
