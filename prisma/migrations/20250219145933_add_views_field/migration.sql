-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "userName" TEXT NOT NULL,
    "password" TEXT,
    "isAdmin" BOOLEAN NOT NULL DEFAULT false,
    "institution" TEXT,
    "department" TEXT,
    "disciplines" TEXT,
    "fields" TEXT,
    "interests" TEXT,
    "about" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Subcommunity" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "views" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userEmail" TEXT,

    CONSTRAINT "Subcommunity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "Tag_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubcommunityTag" (
    "subcommunityId" TEXT NOT NULL,
    "tagId" TEXT NOT NULL,

    CONSTRAINT "SubcommunityTag_pkey" PRIMARY KEY ("subcommunityId","tagId")
);

-- CreateTable
CREATE TABLE "SubcommunityMember" (
    "userId" TEXT NOT NULL,
    "subcommunityId" TEXT NOT NULL,

    CONSTRAINT "SubcommunityMember_pkey" PRIMARY KEY ("userId","subcommunityId")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_userName_key" ON "User"("userName");

-- CreateIndex
CREATE UNIQUE INDEX "Subcommunity_name_key" ON "Subcommunity"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tag_name_key" ON "Tag"("name");

-- AddForeignKey
ALTER TABLE "Subcommunity" ADD CONSTRAINT "Subcommunity_userEmail_fkey" FOREIGN KEY ("userEmail") REFERENCES "User"("email") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcommunityTag" ADD CONSTRAINT "SubcommunityTag_subcommunityId_fkey" FOREIGN KEY ("subcommunityId") REFERENCES "Subcommunity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcommunityTag" ADD CONSTRAINT "SubcommunityTag_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "Tag"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcommunityMember" ADD CONSTRAINT "SubcommunityMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubcommunityMember" ADD CONSTRAINT "SubcommunityMember_subcommunityId_fkey" FOREIGN KEY ("subcommunityId") REFERENCES "Subcommunity"("id") ON DELETE CASCADE ON UPDATE CASCADE;
