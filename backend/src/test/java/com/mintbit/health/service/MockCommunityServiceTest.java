package com.mintbit.health.service;

import com.mintbit.health.model.dto.community.CommunityFeedResponse;
import com.mintbit.health.model.dto.community.CommunityPostDto;
import com.mintbit.health.model.dto.community.ModerationDecisionRequest;
import com.mintbit.health.model.dto.community.ModerationItemDto;
import com.mintbit.health.model.dto.community.ModerationQueueResponse;
import com.mintbit.health.model.dto.community.MyCommunityPostsResponse;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class MockCommunityServiceTest {

    private final MockCommunityService service = new MockCommunityService();

    @Test
    void feedResponseContainsOnlyApprovedPublicPostsAndCircleMetadata() {
        CommunityFeedResponse response = service.getFeed();

        assertNotNull(response.getCircles());
        assertFalse(response.getCircles().isEmpty());
        assertNotNull(response.getPosts());
        assertFalse(response.getPosts().isEmpty());
        assertTrue(response.getPosts().stream().allMatch(post -> "approved".equals(post.getStatus())));
        assertTrue(response.getPosts().stream().allMatch(post -> post.getCircleName() != null && !post.getCircleName().isBlank()));
    }

    @Test
    void postDetailAndMyPostsExposeModerationAwareAuthorViews() {
        CommunityPostDto detail = service.getPostDetail("post-101");
        MyCommunityPostsResponse mine = service.getMyPosts();

        assertEquals("post-101", detail.getId());
        assertFalse(detail.getComments().isEmpty());
        assertTrue(mine.getPosts().stream().anyMatch(post -> "pending_review".equals(post.getStatus())));
        assertTrue(mine.getPosts().stream().anyMatch(post -> "rejected".equals(post.getStatus())));
        assertTrue(mine.getPosts().stream().anyMatch(post -> "flagged".equals(post.getStatus())));
    }

    @Test
    void moderationDecisionMovesItemBetweenQueues() {
        ModerationQueueResponse pendingQueue = service.getModerationQueue("pending_review");
        assertTrue(pendingQueue.getItems().stream().anyMatch(item -> "post-102".equals(item.getTargetId())));

        ModerationDecisionRequest request = new ModerationDecisionRequest();
        request.setReason("Approved from mobile review");
        request.setReviewerId("ops-h5");

        ModerationItemDto approved = service.approve("post", "post-102", request);
        assertEquals("approved", approved.getCurrentStatus());

        ModerationQueueResponse approvedQueue = service.getModerationQueue("approved");
        assertTrue(approvedQueue.getItems().stream().anyMatch(item -> "post-102".equals(item.getTargetId())));
    }
}
