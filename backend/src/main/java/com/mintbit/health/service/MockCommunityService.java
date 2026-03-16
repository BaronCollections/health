package com.mintbit.health.service;

import com.mintbit.health.model.dto.community.CommunityCircleDto;
import com.mintbit.health.model.dto.community.CommunityCommentDto;
import com.mintbit.health.model.dto.community.CommunityFeedResponse;
import com.mintbit.health.model.dto.community.CommunityPostDto;
import com.mintbit.health.model.dto.community.CreateCommunityCommentRequest;
import com.mintbit.health.model.dto.community.CreateCommunityPostRequest;
import com.mintbit.health.model.dto.community.ModerationDecisionRequest;
import com.mintbit.health.model.dto.community.ModerationItemDto;
import com.mintbit.health.model.dto.community.ModerationQueueResponse;
import com.mintbit.health.model.dto.community.MyCommunityPostsResponse;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class MockCommunityService {

    private final List<CommunityCircleDto> circles = new ArrayList<>();
    private final Map<String, CommunityPostDto> postsById = new LinkedHashMap<>();
    private final Map<String, ModerationItemDto> moderationItemsByTargetId = new LinkedHashMap<>();

    public MockCommunityService() {
        seedCircles();
        seedPosts();
        seedModerationQueue();
    }

    public CommunityFeedResponse getFeed() {
        CommunityFeedResponse response = new CommunityFeedResponse();
        response.setCircles(copyCircles());
        response.setPosts(postsById.values().stream()
                .filter(post -> "approved".equals(post.getStatus()))
                .map(this::copyForPublic)
                .toList());
        return response;
    }

    public CommunityPostDto getPostDetail(String postId) {
        CommunityPostDto post = postsById.get(postId);
        if (post == null) {
            return null;
        }

        if (Boolean.TRUE.equals(post.getViewerOwned())) {
            return copyForAuthor(post);
        }

        return "approved".equals(post.getStatus()) ? copyForPublic(post) : null;
    }

    public CommunityPostDto createPost(CreateCommunityPostRequest request) {
        CommunityPostDto post = new CommunityPostDto();
        post.setId("post-" + UUID.randomUUID());
        post.setAuthorName(blankToDefault(request.getAuthorName(), "Xiaoya"));
        post.setAuthorAvatar(blankToDefault(request.getAuthorAvatar(), "X"));
        post.setAuthorRole(blankToDefault(request.getAuthorRole(), "Particle assistant user"));
        post.setViewerOwned(Boolean.TRUE);
        post.setCircleId(blankToDefault(request.getCircleId(), circles.get(0).getId()));
        post.setCircleName(resolveCircleName(post.getCircleId()));
        post.setStatus("pending_review");
        post.setRelativeTime("Just now");
        post.setContent(blankToDefault(request.getContent(), ""));
        post.setTags(request.getTags() == null ? List.of() : new ArrayList<>(request.getTags()));
        post.setImages(request.getImages() == null ? List.of() : new ArrayList<>(request.getImages()));
        post.setLikes(0);
        post.setSaves(0);
        post.setComments(new ArrayList<>());
        post.setModerationReason("Queued for mobile moderation review.");

        postsById.put(post.getId(), post);
        moderationItemsByTargetId.put(post.getId(), createModerationItem(post, "post", post.getModerationReason()));
        return copyForAuthor(post);
    }

    public CommunityCommentDto addComment(String postId, CreateCommunityCommentRequest request) {
        CommunityPostDto post = requirePost(postId);

        CommunityCommentDto comment = new CommunityCommentDto();
        comment.setId("comment-" + UUID.randomUUID());
        comment.setAuthorName(blankToDefault(request.getAuthorName(), "Xiaoya"));
        comment.setAuthorAvatar(blankToDefault(request.getAuthorAvatar(), "X"));
        comment.setAuthorRole(blankToDefault(request.getAuthorRole(), "Particle assistant user"));
        comment.setViewerOwned(Boolean.TRUE);
        comment.setStatus("pending_review");
        comment.setRelativeTime("Just now");
        comment.setContent(blankToDefault(request.getContent(), ""));
        comment.setLikes(0);
        comment.setModerationReason("Comment queued for moderation.");

        if (post.getComments() == null) {
            post.setComments(new ArrayList<>());
        }
        post.getComments().add(comment);
        moderationItemsByTargetId.put(comment.getId(), createModerationItem(post, "comment", comment.getModerationReason(), comment));
        return copyComment(comment);
    }

    public CommunityPostDto likePost(String postId) {
        CommunityPostDto post = requirePost(postId);
        post.setLikes(post.getLikes() + 1);
        return copyForAuthor(post);
    }

    public CommunityPostDto savePost(String postId) {
        CommunityPostDto post = requirePost(postId);
        post.setSaves(post.getSaves() + 1);
        return copyForAuthor(post);
    }

    public MyCommunityPostsResponse getMyPosts() {
        MyCommunityPostsResponse response = new MyCommunityPostsResponse();
        response.setPosts(postsById.values().stream()
                .filter(post -> Boolean.TRUE.equals(post.getViewerOwned()))
                .filter(post -> !"hidden".equals(post.getStatus()))
                .map(this::copyForAuthor)
                .toList());
        return response;
    }

    public List<CommunityCircleDto> getCircles() {
        return copyCircles();
    }

    public ModerationQueueResponse getModerationQueue(String status) {
        ModerationQueueResponse response = new ModerationQueueResponse();
        response.setStatus(status);
        response.setItems(moderationItemsByTargetId.values().stream()
                .filter(item -> status == null || status.isBlank() || status.equals(item.getCurrentStatus()))
                .map(this::copyModerationItem)
                .toList());
        return response;
    }

    public ModerationItemDto approve(String targetType, String targetId, ModerationDecisionRequest request) {
        return applyDecision(targetType, targetId, "approved", request);
    }

    public ModerationItemDto reject(String targetType, String targetId, ModerationDecisionRequest request) {
        return applyDecision(targetType, targetId, "rejected", request);
    }

    public ModerationItemDto flag(String targetType, String targetId, ModerationDecisionRequest request) {
        return applyDecision(targetType, targetId, "flagged", request);
    }

    public ModerationItemDto restore(String targetType, String targetId, ModerationDecisionRequest request) {
        return applyDecision(targetType, targetId, "pending_review", request);
    }

    private ModerationItemDto applyDecision(String targetType, String targetId, String nextStatus, ModerationDecisionRequest request) {
        if ("post".equals(targetType)) {
            CommunityPostDto post = requirePost(targetId);
            post.setStatus(nextStatus);
            post.setModerationReason(request != null ? request.getReason() : null);
        } else {
            CommunityCommentDto comment = requireComment(targetId);
            comment.setStatus(nextStatus);
            comment.setModerationReason(request != null ? request.getReason() : null);
        }

        ModerationItemDto item = moderationItemsByTargetId.get(targetId);
        if (item == null) {
            throw new IllegalArgumentException("Unsupported moderation target: " + targetId);
        }
        item.setCurrentStatus(nextStatus);
        item.setModerationReason(request != null && request.getReason() != null ? request.getReason() : item.getModerationReason());
        return copyModerationItem(item);
    }

    private CommunityPostDto requirePost(String postId) {
        CommunityPostDto post = postsById.get(postId);
        if (post == null) {
            throw new IllegalArgumentException("Post not found: " + postId);
        }
        return post;
    }

    private CommunityCommentDto requireComment(String commentId) {
        return postsById.values().stream()
                .flatMap(post -> post.getComments().stream())
                .filter(comment -> commentId.equals(comment.getId()))
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Comment not found: " + commentId));
    }

    private List<CommunityCircleDto> copyCircles() {
        return circles.stream().map(this::copyCircle).toList();
    }

    private CommunityPostDto copyForPublic(CommunityPostDto source) {
        CommunityPostDto target = copyPost(source);
        target.setComments(source.getComments().stream()
                .filter(comment -> "approved".equals(comment.getStatus()))
                .map(this::copyComment)
                .toList());
        return target;
    }

    private CommunityPostDto copyForAuthor(CommunityPostDto source) {
        CommunityPostDto target = copyPost(source);
        target.setComments(source.getComments().stream()
                .filter(comment -> !"hidden".equals(comment.getStatus()))
                .map(this::copyComment)
                .toList());
        return target;
    }

    private CommunityPostDto copyPost(CommunityPostDto source) {
        CommunityPostDto target = new CommunityPostDto();
        target.setId(source.getId());
        target.setAuthorName(source.getAuthorName());
        target.setAuthorAvatar(source.getAuthorAvatar());
        target.setAuthorRole(source.getAuthorRole());
        target.setViewerOwned(source.getViewerOwned());
        target.setCircleId(source.getCircleId());
        target.setCircleName(source.getCircleName());
        target.setStatus(source.getStatus());
        target.setRelativeTime(source.getRelativeTime());
        target.setContent(source.getContent());
        target.setTags(source.getTags() == null ? List.of() : new ArrayList<>(source.getTags()));
        target.setImages(source.getImages() == null ? List.of() : new ArrayList<>(source.getImages()));
        target.setLikes(source.getLikes());
        target.setSaves(source.getSaves());
        target.setComments(source.getComments() == null ? List.of() : source.getComments().stream().map(this::copyComment).toList());
        target.setModerationReason(source.getModerationReason());
        return target;
    }

    private CommunityCommentDto copyComment(CommunityCommentDto source) {
        CommunityCommentDto target = new CommunityCommentDto();
        target.setId(source.getId());
        target.setAuthorName(source.getAuthorName());
        target.setAuthorAvatar(source.getAuthorAvatar());
        target.setAuthorRole(source.getAuthorRole());
        target.setViewerOwned(source.getViewerOwned());
        target.setStatus(source.getStatus());
        target.setRelativeTime(source.getRelativeTime());
        target.setContent(source.getContent());
        target.setLikes(source.getLikes());
        target.setModerationReason(source.getModerationReason());
        return target;
    }

    private CommunityCircleDto copyCircle(CommunityCircleDto source) {
        CommunityCircleDto target = new CommunityCircleDto();
        target.setId(source.getId());
        target.setName(source.getName());
        target.setDescription(source.getDescription());
        target.setMembers(source.getMembers());
        target.setAccent(source.getAccent());
        return target;
    }

    private ModerationItemDto copyModerationItem(ModerationItemDto source) {
        ModerationItemDto target = new ModerationItemDto();
        target.setId(source.getId());
        target.setTargetId(source.getTargetId());
        target.setTargetType(source.getTargetType());
        target.setAuthorName(source.getAuthorName());
        target.setAuthorAvatar(source.getAuthorAvatar());
        target.setCircleName(source.getCircleName());
        target.setCurrentStatus(source.getCurrentStatus());
        target.setRelativeTime(source.getRelativeTime());
        target.setContentPreview(source.getContentPreview());
        target.setModerationReason(source.getModerationReason());
        return target;
    }

    private ModerationItemDto createModerationItem(CommunityPostDto post, String targetType, String reason) {
        return createModerationItem(post, targetType, reason, null);
    }

    private ModerationItemDto createModerationItem(CommunityPostDto post, String targetType, String reason, CommunityCommentDto comment) {
        ModerationItemDto item = new ModerationItemDto();
        item.setId("queue-" + UUID.randomUUID());
        item.setTargetId(comment == null ? post.getId() : comment.getId());
        item.setTargetType(targetType);
        item.setAuthorName(comment == null ? post.getAuthorName() : comment.getAuthorName());
        item.setAuthorAvatar(comment == null ? post.getAuthorAvatar() : comment.getAuthorAvatar());
        item.setCircleName(post.getCircleName());
        item.setCurrentStatus(comment == null ? post.getStatus() : comment.getStatus());
        item.setRelativeTime(comment == null ? post.getRelativeTime() : comment.getRelativeTime());
        item.setContentPreview(comment == null ? post.getContent() : comment.getContent());
        item.setModerationReason(reason);
        return item;
    }

    private String resolveCircleName(String circleId) {
        return circles.stream()
                .filter(circle -> Objects.equals(circleId, circle.getId()))
                .map(CommunityCircleDto::getName)
                .findFirst()
                .orElse(circles.get(0).getName());
    }

    private String blankToDefault(String value, String fallback) {
        return value == null || value.isBlank() ? fallback : value;
    }

    private void seedCircles() {
        circles.add(createCircle("gut-balance", "Gut balance", "Track probiotics, fiber, and digestion feedback.", 12680, "from-[#BFE4C8] to-[#6DB578]"));
        circles.add(createCircle("stress-reset", "Stress reset", "Check in around sleep rhythm and emotional recovery.", 9310, "from-[#DDE7A3] to-[#BFD46C]"));
        circles.add(createCircle("movement-energy", "Movement energy", "Share real feedback from training and recovery.", 7842, "from-[#BFD8F5] to-[#78AEE8]"));
    }

    private void seedPosts() {
        postsById.put("post-101", createPost(
                "post-101",
                "Yu Chen",
                "Y",
                "Gut reset stage",
                false,
                "gut-balance",
                "Gut balance",
                "approved",
                "2h ago",
                "On day 12, switching breakfast to higher protein plus soluble fiber finally reduced my afternoon bloating.",
                List.of("Probiotics", "Fiber", "Breakfast"),
                42,
                18,
                null,
                List.of(createComment("comment-101-1", "Xiaoya", "X", "Particle assistant user", true, "approved", "1h ago", "I also started with breakfast changes first, and my appetite stabilized after a week.", 8, null))
        ));

        postsById.put("post-102", createPost(
                "post-102",
                "Xiaoya",
                "X",
                "Particle assistant user",
                true,
                "stress-reset",
                "Stress reset",
                "pending_review",
                "Just now",
                "I moved magnesium to right after dinner today and felt sleepy by 11:10 PM. I want to track this for 7 days.",
                List.of("Magnesium", "Sleep", "Rhythm"),
                0,
                0,
                "Queued for mobile moderation review.",
                List.of(createComment("comment-102-1", "Review status", "R", "System note", false, "pending_review", "Just now", "Comment content will appear after moderation.", 0, "Comment queued for moderation."))
        ));

        postsById.put("post-103", createPost(
                "post-103",
                "Xiaoya",
                "X",
                "Particle assistant user",
                true,
                "movement-energy",
                "Movement energy",
                "rejected",
                "Yesterday",
                "Electrolytes before my last three strength sessions reduced calf cramps, but the copy still sounded too much like a guaranteed result.",
                List.of("Electrolytes", "Recovery"),
                0,
                1,
                "The copy may be read as a definite efficacy claim. Rewrite it as a personal experience.",
                List.of()
        ));

        postsById.put("post-104", createPost(
                "post-104",
                "Xiaoya",
                "X",
                "Particle assistant user",
                true,
                "gut-balance",
                "Gut balance",
                "flagged",
                "2 days ago",
                "I missed two days while traveling, so I restarted my meal-response notes and logged this fluctuation separately.",
                List.of("Travel", "Review"),
                3,
                4,
                "Operations flagged this content for a second review. Check back for the next status update.",
                List.of()
        ));
    }

    private void seedModerationQueue() {
        moderationItemsByTargetId.put("post-102", createModerationItem(postsById.get("post-102"), "post", "Needs a human check for dosage-sensitive phrasing."));
        moderationItemsByTargetId.put("comment-102-1", createModerationItem(
                postsById.get("post-102"),
                "comment",
                "Contains explicit treatment language and needs moderation.",
                createComment("comment-102-1", "Anonymous user", "A", "Guest", false, "flagged", "10m ago", "Can this supplement directly cure insomnia?", 0, "Contains explicit treatment language and needs moderation.")
        ));
        moderationItemsByTargetId.put("post-103", createModerationItem(postsById.get("post-103"), "post", postsById.get("post-103").getModerationReason()));
        moderationItemsByTargetId.put("post-104", createModerationItem(postsById.get("post-104"), "post", postsById.get("post-104").getModerationReason()));
    }

    private CommunityCircleDto createCircle(String id, String name, String description, Integer members, String accent) {
        CommunityCircleDto circle = new CommunityCircleDto();
        circle.setId(id);
        circle.setName(name);
        circle.setDescription(description);
        circle.setMembers(members);
        circle.setAccent(accent);
        return circle;
    }

    private CommunityCommentDto createComment(
            String id,
            String authorName,
            String authorAvatar,
            String authorRole,
            boolean viewerOwned,
            String status,
            String relativeTime,
            String content,
            Integer likes,
            String moderationReason
    ) {
        CommunityCommentDto comment = new CommunityCommentDto();
        comment.setId(id);
        comment.setAuthorName(authorName);
        comment.setAuthorAvatar(authorAvatar);
        comment.setAuthorRole(authorRole);
        comment.setViewerOwned(viewerOwned);
        comment.setStatus(status);
        comment.setRelativeTime(relativeTime);
        comment.setContent(content);
        comment.setLikes(likes);
        comment.setModerationReason(moderationReason);
        return comment;
    }

    private CommunityPostDto createPost(
            String id,
            String authorName,
            String authorAvatar,
            String authorRole,
            boolean viewerOwned,
            String circleId,
            String circleName,
            String status,
            String relativeTime,
            String content,
            List<String> tags,
            Integer likes,
            Integer saves,
            String moderationReason,
            List<CommunityCommentDto> comments
    ) {
        CommunityPostDto post = new CommunityPostDto();
        post.setId(id);
        post.setAuthorName(authorName);
        post.setAuthorAvatar(authorAvatar);
        post.setAuthorRole(authorRole);
        post.setViewerOwned(viewerOwned);
        post.setCircleId(circleId);
        post.setCircleName(circleName);
        post.setStatus(status);
        post.setRelativeTime(relativeTime);
        post.setContent(content);
        post.setTags(tags == null ? List.of() : new ArrayList<>(tags));
        post.setImages(new ArrayList<>());
        post.setLikes(likes);
        post.setSaves(saves);
        post.setComments(comments == null ? new ArrayList<>() : new ArrayList<>(comments));
        post.setModerationReason(moderationReason);
        return post;
    }
}
