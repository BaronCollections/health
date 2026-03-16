package com.mintbit.health.model.dto.community;

import lombok.Data;

import java.util.List;

@Data
public class CreateCommunityPostRequest {

    private String circleId;
    private String content;
    private List<String> tags;
    private List<String> images;
    private String authorName;
    private String authorAvatar;
    private String authorRole;
}
