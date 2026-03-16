package com.mintbit.health.model.dto.community;

import lombok.Data;

@Data
public class CommunityCircleDto {

    private String id;
    private String name;
    private String description;
    private Integer members;
    private String accent;
}
