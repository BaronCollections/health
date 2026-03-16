package com.mintbit.health.model.dto.account;

import lombok.Data;

import java.util.List;

@Data
public class AccountFaqCategoryDto {

    private String id;
    private String title;
    private List<AccountFaqItemDto> items;
}
