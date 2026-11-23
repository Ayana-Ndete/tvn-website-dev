#!/bin/bash
set -e  # Exit immediately on errors

# === 1. Choose deployment profile ===
echo "Select deployment environment:"
select PROFILE in "tvn" "uat" "prod" "quit"; do
    case $PROFILE in
        tvn)
            ENV_FILE=".env.tvn"
            break
            ;;
        uat)
            ENV_FILE=".env.uat"
            break
            ;;
        prod)
            ENV_FILE=".env.prod"
            break
            ;;
        quit)
            echo "Aborted."
            exit 0
            ;;
        *)
            echo "Invalid selection. Choose again."
            ;;
    esac
done

# === 2. Handle .env file selection/switching ===

if [ ! -f "$ENV_FILE" ]; then
    echo "Error: $ENV_FILE does not exist. Deployment aborted."
    exit 1
fi

if [ -f .env ]; then
    echo "Backing up existing .env file..."
    mv .env .env.backup
fi

echo "Copying $ENV_FILE to .env..."
cp "$ENV_FILE" .env

# === 3. Extract CONTEXT_PATH from .env (now set) ===
CONTEXT_PATH=$(grep '^CONTEXT_PATH=' .env | cut -d '=' -f2-)
if [ -z "$CONTEXT_PATH" ]; then
    echo "CONTEXT_PATH not found in .env file!"
    exit 1
fi
echo "Using CONTEXT_PATH: $CONTEXT_PATH"

# === 4. Build the nuxt app ===
echo "Building the Nuxt app..."
npm run build
echo "Build completed successfully."

# === 5. Zip the build output and .env file ===
echo "Zipping the build output and .env..."
zip -9 -r tvn-website.zip .output/ prisma/
echo "Zipping completed successfully."

# === 6. Upload and deploy based on profile ===
case $PROFILE in
    tvn)
        SERVER="tvn"
        DEPLOY_PATH="/home/developer/tvn-website-test"
        SERVICE_NAME="tvn-website-test"
        ;;
    uat)
        SERVER="biasharalink-uat"
        DEPLOY_PATH="/opt/tvn-website"
        SERVICE_NAME="tvn-website-uat"
        ;;
    prod)
        SERVER="tvn"
        DEPLOY_PATH="/home/developer/tvn-website-prod"
        SERVICE_NAME="tvn-website-prod"
        ;;
esac

echo "Uploading the zip file to the $PROFILE server ($SERVER)..."
rsync -avz --progress tvn-website.zip $SERVER:$DEPLOY_PATH
echo "Upload completed successfully."

echo "Deploying the app on the $PROFILE server..."
ssh $SERVER << ENDSSH
set -e
cd $DEPLOY_PATH
if [ -d ".output" ]; then
    echo "Removing old app directory..."
    rm -rf .output
fi
echo "Unzipping the new app..."
unzip -o tvn-website.zip
echo "Unzipping completed successfully."
echo "Starting the app..."
service $SERVICE_NAME restart
echo "App started successfully. View logs with 'journalctl -u $SERVICE_NAME -f'."
echo "Deployment on ->-> $PROFILE <-<- server completed successfully."
ENDSSH

echo "Deployment completed successfully."

# === 7. Clean up the local zip file ===
echo "Cleaning up the local zip file..."
rm tvn-website.zip
echo "Cleanup completed successfully."

# === 8. Restore previous .env file if exists ===
if [ -f .env.backup ]; then
    echo "Restoring previous .env file..."
    rm .env
    mv .env.backup .env
fi

echo "Deployment script completed successfully."
