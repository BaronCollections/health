package com.mintbit.health.model.dto.community;

import lombok.Data;

import java.util.List;

@Data
public class CommunityFeedResponse {

    private List<CommunityCircleDto> circles;
    private List<CommunityPostDto> posts;
}
