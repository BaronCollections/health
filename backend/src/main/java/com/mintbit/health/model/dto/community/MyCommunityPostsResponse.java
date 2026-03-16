package com.mintbit.health.model.dto.community;

import lombok.Data;

import java.util.List;

@Data
public class MyCommunityPostsResponse {

    private List<CommunityPostDto> posts;
}
