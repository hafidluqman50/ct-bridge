// Package external — StorageService uploads flowchart photos to Supabase
// Storage via its S3-compatible API, so photos survive a server restart and
// can be shown again from History (not just within the upload session).
package external

import (
	"bytes"
	"context"
	"fmt"

	"github.com/aws/aws-sdk-go-v2/aws"
	awsCreds "github.com/aws/aws-sdk-go-v2/credentials"
	"github.com/aws/aws-sdk-go-v2/service/s3"
)

type StorageService struct {
	client        *s3.Client
	bucket        string
	publicBaseURL string // e.g. https://<ref>.supabase.co/storage/v1/object/public
}

func NewStorageService(endpoint, accessKey, secretKey, region, bucket, publicBaseURL string) *StorageService {
	client := s3.New(s3.Options{
		Region:       region,
		BaseEndpoint: aws.String(endpoint),
		Credentials:  awsCreds.NewStaticCredentialsProvider(accessKey, secretKey, ""),
		UsePathStyle: true,
	})
	return &StorageService{client: client, bucket: bucket, publicBaseURL: publicBaseURL}
}

// EnsureBucket creates the bucket if it does not already exist. Errors are
// returned so the caller can decide whether a missing/failed bucket should
// block startup; "already exists" style errors are treated as success.
func (s *StorageService) EnsureBucket(ctx context.Context) error {
	_, err := s.client.CreateBucket(ctx, &s3.CreateBucketInput{Bucket: aws.String(s.bucket)})
	if err == nil {
		return nil
	}
	// Supabase/S3 report existing buckets differently depending on ownership;
	// treat any "already" mention as non-fatal.
	if bytes.Contains([]byte(err.Error()), []byte("already")) {
		return nil
	}
	return fmt.Errorf("create bucket %q: %w", s.bucket, err)
}

// Upload puts the given bytes at key and returns the public URL. The bucket
// must be configured as public in the Supabase dashboard for this URL to be
// viewable without a signed request.
func (s *StorageService) Upload(ctx context.Context, key string, data []byte, contentType string) (string, error) {
	_, err := s.client.PutObject(ctx, &s3.PutObjectInput{
		Bucket:      aws.String(s.bucket),
		Key:         aws.String(key),
		Body:        bytes.NewReader(data),
		ContentType: aws.String(contentType),
	})
	if err != nil {
		return "", fmt.Errorf("upload %q: %w", key, err)
	}
	return fmt.Sprintf("%s/%s/%s", s.publicBaseURL, s.bucket, key), nil
}
